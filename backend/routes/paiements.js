
const express = require('express');
const router = express.Router();
const Paiement = require('../models/Paiement');
const Candidat = require('../models/Candidat');

// GET /api/paiements - Récupérer tous les paiements
router.get('/', async (req, res) => {
  try {
    const paiements = await Paiement.findAll();
    res.json({ 
      success: true, 
      data: paiements, 
      message: 'Paiements récupérés avec succès' 
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      errors: [error.message] 
    });
  }
});

// POST /api/paiements - Créer un nouveau paiement
router.post('/', async (req, res) => {
  try {
    const { nipcan, montant, methode } = req.body;

    console.log('Création paiement pour:', { nipcan, montant, methode });

    if (!nipcan || !montant) {
      return res.status(400).json({
        success: false,
        message: 'NIP candidat et montant requis',
        errors: ['nipcan et montant sont obligatoires']
      });
    }

    // Rechercher le candidat
    const candidat = await Candidat.findByNip(nipcan);
    if (!candidat) {
      return res.status(404).json({
        success: false,
        message: 'Candidat introuvable'
      });
    }

    const paiementData = {
      candidat_id: candidat.id,
      mntfrai: montant,
      datfrai: new Date().toISOString().split('T')[0],
      montant: montant,
      statut: 'valide' // Simuler une validation automatique
    };

    const paiement = await Paiement.create(paiementData);
    
    console.log('Paiement créé:', paiement);

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

module.exports = router;
