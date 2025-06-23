
const express = require('express');
const router = express.Router();
const Paiement = require('../models/Paiement');

// POST /api/payements - Créer un nouveau paiement (orthographe de l'API originale)
router.post('/', async (req, res) => {
  try {
    const paiement = await Paiement.create(req.body);
    res.status(201).json({ 
      success: true, 
      data: paiement, 
      message: 'Paiement créé avec succès' 
    });
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      errors: [error.message] 
    });
  }
});

// GET /api/paiements/candidat/:candidat_id - Récupérer les paiements d'un candidat
router.get('/candidat/:candidat_id', async (req, res) => {
  try {
    const { getConnection } = require('../config/database');
    const connection = getConnection();
    
    const [rows] = await connection.execute(
      'SELECT * FROM paiements WHERE candidat_id = ? ORDER BY created_at DESC',
      [req.params.candidat_id]
    );
    
    res.json({ data: rows });
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      errors: [error.message] 
    });
  }
});

// GET /api/participations/:id/paiement - Récupérer le paiement d'une participation
router.get('/participations/:id/paiement', async (req, res) => {
  try {
    const paiement = await Paiement.findByParticipation(req.params.id);
    if (!paiement) {
      return res.status(404).json({ 
        success: false, 
        message: 'Aucun paiement trouvé pour cette participation' 
      });
    }
    res.json({ data: paiement });
  } catch (error) {
    console.error('Erreur lors de la récupération du paiement:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      errors: [error.message] 
    });
  }
});

// POST /api/paiements/:id/validate - Valider un paiement
router.post('/:id/validate', async (req, res) => {
  try {
    const paiement = await Paiement.validate(req.params.id);
    res.json({ 
      success: true, 
      data: paiement, 
      message: 'Paiement validé avec succès' 
    });
  } catch (error) {
    console.error('Erreur lors de la validation du paiement:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      errors: [error.message] 
    });
  }
});

// GET /api/paiements - Récupérer tous les paiements (pour l'admin)
router.get('/', async (req, res) => {
  try {
    const { getConnection } = require('../config/database');
    const connection = getConnection();
    
    const [rows] = await connection.execute(
      `SELECT p.*, c.nomcan, c.prncan, c.nupcan
       FROM paiements p
       LEFT JOIN candidats c ON p.candidat_id = c.id
       ORDER BY p.created_at DESC`
    );
    
    res.json({ data: rows });
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      errors: [error.message] 
    });
  }
});

module.exports = router;
