
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
app.use('/api/payements', require('./routes/paiements')); // Note: orthographe originale
app.use('/api/dossiers', require('./routes/dossiers'));

// Route de base
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
      '/api/dossiers'
    ]
  });
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
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
