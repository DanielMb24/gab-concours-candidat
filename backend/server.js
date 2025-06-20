
const express = require('express');
const path = require('path');
require('dotenv').config();

const { createConnection } = require('./config/database');
const corsMiddleware = require('./middleware/cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API
app.use('/api/concours', require('./routes/concours'));
app.use('/api/candidats', require('./routes/candidats'));
app.use('/api/etudiants', require('./routes/etudiants'));
app.use('/api/participations', require('./routes/participations'));
app.use('/api/provinces', require('./routes/provinces'));
app.use('/api/payements', require('./routes/paiements'));
app.use('/api/dossiers', require('./routes/dossiers'));
app.use('/api/etablissements', require('./routes/etablissements'));
app.use('/api/niveaux', require('./routes/niveaux'));

// Routes d'administration
app.use('/api', require('./routes/admin'));

// Route de base avec statistiques
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API GabConcours - Backend fonctionnel',
    version: '1.0.0',
    endpoints: [
      '/api/concours',
      '/api/candidats',
      '/api/etudiants',
      '/api/participations',
      '/api/provinces',
      '/api/payements',
      '/api/dossiers',
      '/api/etablissements',
      '/api/niveaux'
    ]
  });
});

// Route pour les statistiques
app.get('/api/statistics', async (req, res) => {
  try {
    const { getConnection } = require('./config/database');
    const connection = getConnection();
    
    // Récupérer les statistiques
    const [concoursCount] = await connection.execute('SELECT COUNT(*) as count FROM concours');
    const [candidatsCount] = await connection.execute('SELECT COUNT(*) as count FROM candidats');
    const [participationsCount] = await connection.execute('SELECT COUNT(*) as count FROM participations');
    const [etablissementsCount] = await connection.execute('SELECT COUNT(*) as count FROM etablissements');
    const [paiementsCount] = await connection.execute('SELECT COUNT(*) as count FROM paiements');
    
    res.json({
      success: true,
      data: {
        concours: concoursCount[0].count,
        candidats: candidatsCount[0].count,
        participations: participationsCount[0].count,
        etablissements: etablissementsCount[0].count,
        paiements: paiementsCount[0].count
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      errors: [error.message] 
    });
  }
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint non trouvé' 
  });
});

// Gestion des erreurs globales
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Erreur interne du serveur',
    errors: process.env.NODE_ENV === 'development' ? [error.message] : []
  });
});

// Démarrage du serveur
const startServer = async () => {
  try {
    // Initialiser la connexion à la base de données
    await createConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📡 API accessible sur: http://localhost:${PORT}/api`);
      console.log(`🗄️  Base de données: ${process.env.DB_NAME || 'gabconcours'}`);
      console.log(`👨‍💼 Interface admin: http://localhost:5173/admin`);
      console.log(`🔑 Login admin: admin@gabconcours.ga / admin123`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer().then(r => {});

module.exports = app;
