
const express = require('express');
const router = express.Router();
const Candidat = require('../models/Candidat');

// GET /api/candidats - Récupérer tous les candidats (pour l'admin)
router.get('/', async (req, res) => {
  try {
    const { getConnection } = require('../config/database');
    const connection = getConnection();
    
    const [rows] = await connection.execute(
      `SELECT c.*, n.nomniv as niveau_nomniv,
              COUNT(p.id) as participations_count
       FROM candidats c 
       LEFT JOIN niveaux n ON c.niveau_id = n.id
       LEFT JOIN participations p ON c.id = p.candidat_id
       GROUP BY c.id
       ORDER BY c.created_at DESC`
    );
    
    res.json({ data: rows });
  } catch (error) {
    console.error('Erreur lors de la récupération des candidats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      errors: [error.message] 
    });
  }
});

// GET /api/candidats/:id - Récupérer un candidat par ID
router.get('/:id', async (req, res) => {
  try {
    const candidat = await Candidat.findById(req.params.id);
    if (!candidat) {
      return res.status(404).json({ 
        success: false, 
        message: 'Candidat non trouvé' 
      });
    }
    res.json({ data: candidat });
  } catch (error) {
    console.error('Erreur lors de la récupération du candidat:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      errors: [error.message] 
    });
  }
});

// GET /api/candidats/nip/:nip - Récupérer un candidat par NIP
router.get('/nip/:nip', async (req, res) => {
  try {
    const candidat = await Candidat.findByNip(req.params.nip);
    if (!candidat) {
      return res.status(404).json({ 
        success: false, 
        message: 'Candidat non trouvé avec ce NIP' 
      });
    }
    res.json({ data: candidat });
  } catch (error) {
    console.error('Erreur lors de la recherche par NIP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      errors: [error.message] 
    });
  }
});

// POST /api/candidats - Créer un nouveau candidat
router.post('/', async (req, res) => {
  try {
    const candidat = await Candidat.create(req.body);
    res.status(201).json({ 
      success: true, 
      data: candidat, 
      message: 'Candidat créé avec succès' 
    });
  } catch (error) {
    console.error('Erreur lors de la création du candidat:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      errors: [error.message] 
    });
  }
});

// PUT /api/candidats/:id - Mettre à jour un candidat
router.put('/:id', async (req, res) => {
  try {
    const candidat = await Candidat.update(req.params.id, req.body);
    if (!candidat) {
      return res.status(404).json({ 
        success: false, 
        message: 'Candidat non trouvé' 
      });
    }
    res.json({ 
      success: true, 
      data: candidat, 
      message: 'Candidat mis à jour avec succès' 
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du candidat:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      errors: [error.message] 
    });
  }
});

// GET /api/candidats/:id/participations - Récupérer les participations d'un candidat
router.get('/:id/participations', async (req, res) => {
  try {
    const participations = await Candidat.getParticipations(req.params.id);
    res.json({ data: participations });
  } catch (error) {
    console.error('Erreur lors de la récupération des participations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      errors: [error.message] 
    });
  }
});

module.exports = router;
