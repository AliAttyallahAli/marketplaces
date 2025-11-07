// Simulation des APIs Mobile Money Tchad
class MobileMoneyTchad {
    static async processPayment(fromPhone, toPhone, amount, service = 'p2p') {
        // Simulation d'appel API mobile money
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: 'MM_' + Date.now(),
                    amount: amount,
                    from: fromPhone,
                    to: toPhone,
                    service: service,
                    timestamp: new Date().toISOString()
                });
            }, 1000);
        });
    }

    static async checkBalance(phone) {
        // Simulation vérification solde
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    phone: phone,
                    balance: Math.random() * 1000000, // Solde simulé
                    currency: 'XAF'
                });
            }, 500);
        });
    }

    static async verifyTransaction(transactionId) {
        // Simulation vérification transaction
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: transactionId,
                    status: 'completed',
                    verified: true
                });
            }, 300);
        });
    }
}

module.exports = MobileMoneyTchad;