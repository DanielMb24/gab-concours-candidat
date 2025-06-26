const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Paiement = require('../models/Paiement');
const Candidat = require('../models/Candidat');

router.get('/', authenticateToken, async (req, res) => {
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

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nipcan, montant, methode } = req.body;

    if (!nipcan || !montant) {
      return res.status(400).json({
        success: false,
        message: 'NIP candidat et montant requis',
        errors: ['nipcan et montant sont obligatoires']
      });
    }

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
      statut: 'valide'
    };

    const paiement = await Paiement.create(paiementData);

    res.status(201).json({
      success: true,
      data: paiement,
      message: 'Paiement créé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    res.status(422).json({
      success: false,
      message: 'Erreur de validation',
      errors: [error.message]
    });
  }
});

router.get('/participations/:id/paiement', authenticateToken, async (req, res) => {
  try {
    const paiement = await Paiement.findByParticipation(req.params.id);
    if (!paiement) {
      return res.status(404).json({
        success: false,
        message: 'Aucun paiement trouvé pour cette participation'
      });
    }
    res.json({ success: true, data: paiement });
  } catch (error) {
    console.error('Erreur lors de la récupération du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      errors: [error.message]
    });
  }
});

router.post('/:id/validate', authenticateToken, async (req, res) => {
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

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Paiement.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      errors: [error.message]
    });
  }
});

module.exports = router;