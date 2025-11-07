import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, Tab, Tabs } from 'react-bootstrap';
import { newsletterAPI } from '../../services/newsletter';
import { useAuth } from '../../context/AuthContext';

const NewsletterManagement = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('subscribers');
  const [stats, setStats] = useState({});
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      const [statsRes, subscribersRes, campaignsRes] = await Promise.all([
        newsletterAPI.getStats(),
        newsletterAPI.getSubscribers(),
        newsletterAPI.getCampaigns()
      ]);

      setStats(statsRes.data.stats);
      setSubscribers(subscribersRes.data.subscribers);
      setCampaigns(campaignsRes.data.campaigns);
    } catch (error) {
      console.error('Error loading newsletter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const CampaignModal = () => {
    const [campaignData, setCampaignData] = useState({
      title: '',
      subject: '',
      content: '',
      template: 'default',
      scheduled_for: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      // Implémenter la création de campagne
      console.log('Créer campagne:', campaignData);
      setShowCampaignModal(false);
    };

    return (
      <Modal show={showCampaignModal} onHide={() => setShowCampaignModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nouvelle Campagne Email</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Titre de la campagne *</Form.Label>
              <Form.Control
                type="text"
                value={campaignData.title}
                onChange={(e) => setCampaignData({...campaignData, title: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sujet *</Form.Label>
              <Form.Control
                type="text"
                value={campaignData.subject}
                onChange={(e) => setCampaignData({...campaignData, subject: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contenu *</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                value={campaignData.content}
                onChange={(e) => setCampaignData({...campaignData, content: e.target.value})}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Template</Form.Label>
                  <Form.Select
                    value={campaignData.template}
                    onChange={(e) => setCampaignData({...campaignData, template: e.target.value})}
                  >
                    <option value="default">Default</option>
                    <option value="promotion">Promotion</option>
                    <option value="news">Actualités</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Planifier pour</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={campaignData.scheduled_for}
                    onChange={(e) => setCampaignData({...campaignData, scheduled_for: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCampaignModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Créer la campagne
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };

  if (!isAdmin) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="fas fa-lock fa-3x text-muted mb-3"></i>
          <h3 className="text-muted">Accès réservé aux administrateurs</h3>
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
              <h1 className="fw-bold">Gestion Newsletter</h1>
              <p className="text-muted">Gérez les abonnements et campagnes email</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowCampaignModal(true)}
            >
              <i className="fas fa-plus me-2"></i>
              Nouvelle Campagne
            </Button>
          </div>
        </Col>
      </Row>

      {/* Statistiques */}
      <Row className="mb-4">
        <Col xl={3} lg={6} className="mb-3">
          <Card className="border-0 bg-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{stats.total_subscribers || 0}</h4>
                  <p className="mb-0">Abonnés actifs</p>
                </div>
                <i className="fas fa-users fa-2x opacity-50"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6} className="mb-3">
          <Card className="border-0 bg-success text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{stats.total_campaigns || 0}</h4>
                  <p className="mb-0">Campagnes</p>
                </div>
                <i className="fas fa-paper-plane fa-2x opacity-50"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6} className="mb-3">
          <Card className="border-0 bg-warning text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{stats.avg_open_rate ? `${stats.avg_open_rate.toFixed(1)}%` : '0%'}</h4>
                  <p className="mb-0">Taux d'ouverture</p>
                </div>
                <i className="fas fa-chart-line fa-2x opacity-50"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6} className="mb-3">
          <Card className="border-0 bg-info text-white">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="fw-bold">{stats.total_unsubscribed || 0}</h4>
                  <p className="mb-0">Désabonnements</p>
                </div>
                <i className="fas fa-user-times fa-2x opacity-50"></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        {/* Abonnés */}
        <Tab eventKey="subscribers" title={
          <span>
            <i className="fas fa-users me-2"></i>
            Abonnés ({subscribers.length})
          </span>
        }>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Liste des Abonnés</h5>
            </Card.Header>
            <Card.Body>
              {subscribers.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-users-slash fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Aucun abonné</h5>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Nom</th>
                        <th>Téléphone</th>
                        <th>Date d'inscription</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map(subscriber => (
                        <tr key={subscriber.id}>
                          <td>
                            <strong>{subscriber.email}</strong>
                            {subscriber.user_id && (
                              <Badge bg="info" className="ms-2">Utilisateur</Badge>
                            )}
                          </td>
                          <td>{subscriber.nom || '-'}</td>
                          <td>{subscriber.phone || '-'}</td>
                          <td>
                            {new Date(subscriber.subscription_date).toLocaleDateString('fr-FR')}
                          </td>
                          <td>
                            <Badge bg={
                              subscriber.status === 'active' ? 'success' : 
                              subscriber.status === 'unsubscribed' ? 'secondary' : 'warning'
                            }>
                              {subscriber.status}
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

        {/* Campagnes */}
        <Tab eventKey="campaigns" title={
          <span>
            <i className="fas fa-paper-plane me-2"></i>
            Campagnes ({campaigns.length})
          </span>
        }>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Campagnes Email</h5>
            </Card.Header>
            <Card.Body>
              {campaigns.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">Aucune campagne</h5>
                  <p className="text-muted">Créez votre première campagne email</p>
                  <Button 
                    variant="primary" 
                    onClick={() => setShowCampaignModal(true)}
                  >
                    Créer une campagne
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Titre</th>
                        <th>Sujet</th>
                        <th>Statut</th>
                        <th>Destinataires</th>
                        <th>Ouvertures</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map(campaign => (
                        <tr key={campaign.id}>
                          <td>
                            <strong>{campaign.title}</strong>
                            <br />
                            <small className="text-muted">
                              Par {campaign.created_by_name}
                            </small>
                          </td>
                          <td>{campaign.subject}</td>
                          <td>
                            <Badge bg={
                              campaign.status === 'sent' ? 'success' :
                              campaign.status === 'scheduled' ? 'warning' :
                              campaign.status === 'draft' ? 'secondary' : 'primary'
                            }>
                              {campaign.status}
                            </Badge>
                          </td>
                          <td>{campaign.total_recipients}</td>
                          <td>
                            {campaign.opened_count} 
                            {campaign.total_recipients > 0 && (
                              <small className="text-muted ms-1">
                                ({Math.round((campaign.opened_count / campaign.total_recipients) * 100)}%)
                              </small>
                            )}
                          </td>
                          <td>
                            {campaign.sent_at 
                              ? new Date(campaign.sent_at).toLocaleDateString('fr-FR')
                              : new Date(campaign.created_at).toLocaleDateString('fr-FR')
                            }
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
      </Tabs>

      <CampaignModal />
    </Container>
  );
};

export default NewsletterManagement;