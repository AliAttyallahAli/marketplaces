import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Tabs, Tab, Form, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/products';
import { walletAPI } from '../services/wallet';
import ProductForm from '../components/products/ProductForm';

const Vendeur = () => {
  const { user, isVendeur } = useAuth();
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({});
  const [showProductModal, setShowProductModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isVendeur) {
      loadVendeurData();
    }
  }, [isVendeur]);

  const loadVendeurData = async () => {
    try {
     const [productsRes, transactionsRes] = await Promise.all([
  productsAPI.getByVendeur ? productsAPI.getByVendeur(user.id) : Promise.resolve({ data: [] }),
  walletAPI.getVendeurTransactions()
]);

      setProducts(productsRes.data || []);
      setTransactions(transactionsRes.data.transactions || []);

      // Calcul des statistiques
      const totalProducts = productsRes.data?.length || 0;
      const totalSales = transactionsRes.data.transactions?.length || 0;
      const totalRevenue = transactionsRes.data.transactions?.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0) || 0;

      setStats({
        totalProducts,
        totalSales,
        totalRevenue
      });
    } catch (error) {
      console.error('Error loading vendeur data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      try {
        await productsAPI.delete(productId);
        loadVendeurData(); // Recharger les données
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleProductCreated = () => {
    setShowProductModal(false);
    loadVendeurData(); // Recharger les données
  };

  if (!isVendeur) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <i className="fas fa-lock fa-3x text-muted mb-3"></i>
          <h3 className="fw-bold">Accès non autorisé</h3>
          <p className="text-muted">
            Vous devez être vendeur pour accéder à cette page
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Dashboard Vendeur</h1>
              <p className="text-muted">Gérez vos produits et ventes</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowProductModal(true)}
            >
              <i className="fas fa-plus me-2"></i>
              Ajouter un produit
            </Button>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col xl={4} lg={6} className="mb-3">
          <Card className="border-0 bg-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{stats.totalProducts}</h4>
                  <p className="mb-0">Produits actifs</p>
                </div>
                <div className="icon-wrapper">
                  <i className="fas fa-box fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={4} lg={6} className="mb-3">
          <Card className="border-0 bg-success text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{stats.totalSales}</h4>
                  <p className="mb-0">Ventes totales</p>
                </div>
                <div className="icon-wrapper">
                  <i className="fas fa-shopping-cart fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={4} lg={6} className="mb-3">
          <Card className="border-0 bg-warning text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">
                    {stats.totalRevenue?.toLocaleString('fr-TD')} FCFA
                  </h4>
                  <p className="mb-0">Chiffre d'affaires</p>
                </div>
                <div className="icon-wrapper">
                  <i className="fas fa-chart-line fa-2x"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="products" className="mb-4">
        <Tab eventKey="products" title={
          <span>
            <i className="fas fa-box me-2"></i>
            Mes Produits
          </span>
        }>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Gestion des Produits</h5>
            </Card.Header>
            <Card.Body>
              {products.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Aucun produit</h5>
                  <p className="text-muted mb-4">
                    Commencez par ajouter votre premier produit
                  </p>
                  <Button 
                    variant="primary"
                    onClick={() => setShowProductModal(true)}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Ajouter un produit
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Prix</th>
                        <th>Catégorie</th>
                        <th>État</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {product.photos && product.photos.length > 0 ? (
                                <img 
                                  src={product.photos[0]} 
                                  alt={product.nom}
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                  className="rounded me-3"
                                />
                              ) : (
                                <div 
                                  className="bg-light rounded d-flex align-items-center justify-content-center me-3"
                                  style={{ width: '40px', height: '40px' }}
                                >
                                  <i className="fas fa-image text-muted"></i>
                                </div>
                              )}
                              <div>
                                <strong>{product.nom}</strong>
                                <br />
                                <small className="text-muted">
                                  {product.description?.substring(0, 50)}...
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <strong>{parseFloat(product.prix).toLocaleString('fr-TD')} FCFA</strong>
                          </td>
                          <td>
                            <Badge bg="secondary">{product.categorie}</Badge>
                          </td>
                          <td>
                            <Badge bg={
                              product.etat === 'neuf' ? 'success' :
                              product.etat === 'occasion' ? 'warning' : 'info'
                            }>
                              {product.etat}
                            </Badge>
                          </td>
                          <td>
                            {product.is_active ? (
                              <Badge bg="success">Actif</Badge>
                            ) : (
                              <Badge bg="danger">Inactif</Badge>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button size="sm" variant="outline-primary">
                                <i className="fas fa-edit"></i>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline-danger"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <i className="fas fa-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="sales" title={
          <span>
            <i className="fas fa-chart-line me-2"></i>
            Mes Ventes
          </span>
        }>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Historique des Ventes</h5>
            </Card.Header>
            <Card.Body>
              {transactions.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-receipt fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Aucune vente</h5>
                  <p className="text-muted">
                    Vos ventes apparaîtront ici
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Client</th>
                        <th>Produit</th>
                        <th>Montant</th>
                        <th>Frais</th>
                        <th>Net</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(transaction => (
                        <tr key={transaction.id}>
                          <td>
                            <small>
                              {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                            </small>
                          </td>
                          <td>
                            <small>
                              {transaction.from_nom} {transaction.from_prenom}
                            </small>
                          </td>
                          <td>
                            <small>{transaction.product_nom}</small>
                          </td>
                          <td>
                            <strong>{parseFloat(transaction.amount).toLocaleString('fr-TD')} FCFA</strong>
                          </td>
                          <td>
                            <span className="text-danger">
                              -{parseFloat(transaction.fee).toLocaleString('fr-TD')} FCFA
                            </span>
                          </td>
                          <td>
                            <span className="text-success">
                              {(parseFloat(transaction.amount) - parseFloat(transaction.fee)).toLocaleString('fr-TD')} FCFA
                            </span>
                          </td>
                          <td>
                            <Badge bg={
                              transaction.status === 'completed' ? 'success' :
                              transaction.status === 'pending' ? 'warning' : 'danger'
                            }>
                              {transaction.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="analytics" title={
          <span>
            <i className="fas fa-chart-bar me-2"></i>
            Analytics
          </span>
        }>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Statistiques de Vente</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="bg-light p-4 rounded text-center">
                    <i className="fas fa-shopping-cart fa-2x text-primary mb-3"></i>
                    <h4>{stats.totalSales}</h4>
                    <p className="text-muted mb-0">Ventes totales</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="bg-light p-4 rounded text-center">
                    <i className="fas fa-money-bill-wave fa-2x text-success mb-3"></i>
                    <h4>{stats.totalRevenue?.toLocaleString('fr-TD')} FCFA</h4>
                    <p className="text-muted mb-0">Chiffre d'affaires</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Modal d'ajout de produit */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un nouveau produit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductForm onSuccess={handleProductCreated} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Vendeur;