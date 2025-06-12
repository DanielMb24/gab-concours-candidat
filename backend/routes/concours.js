
const express = require('express');
const router = express.Router();
const Concours = require('../models/Concours');

// GET /api/concours - Récupérer tous les concours
router.get('/', async (req, res) => {
  try {
    const concours = await Concours.findAll();
    res.json({ data: concours });
  } catch (error) {
    console.error('Erreur lors de la récupération des concours:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      errors: [error.message] 
    });
  }
});

// GET /api/concours/:id - Récupérer un concours par ID
router.get('/:id', async (req, res) => {
  try {
    const concours = await Concours.findById(req.params.id);
    if (!concours) {
      return res.status(404).json({ 
        success: false, 
        message: 'Concours non trouvé' 
      });
    }
    res.json({ data: concours });
  } catch (error) {
    console.error('Erreur lors de la récupération du concours:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      errors: [error.message] 
    });
  }
});

// POST /api/concours - Créer un nouveau concours
router.post('/', async (req, res) => {
  try {
    const concours = await Concours.create(req.body);
    res.status(201).json({ 
      success: true, 
      data: concours, 
      message: 'Concours créé avec succès' 
    });
  } catch (error) {
    console.error('Erreur lors de la création du concours:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      errors: [error.message] 
    });
  }
});

module.exports = router;
