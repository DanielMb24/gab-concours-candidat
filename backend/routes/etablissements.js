const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Etablissement = require('../models/Etablissement');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const etablissements = await Etablissement.findAll();
    res.json({ success: true, data: etablissements });
  } catch (error) {
    console.error('Erreur lors de la récupération des établissements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      errors: [error.message]
    });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const etablissement = await Etablissement.findById(req.params.id);
    if (!etablissement) {
      return res.status(404).json({
        success: false,
        message: 'Établissement non trouvé'
      });
    }
    res.json({ success: true, data: etablissement });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'établissement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      errors: [error.message]
    });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const etablissement = await Etablissement.create(req.body);
    res.status(201).json({
      success: true,
      data: etablissement,
      message: 'Établissement créé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'établissement:', error);
    res.status(422).json({
      success: false,
      message: 'Erreur de validation',
      errors: [error.message]
    });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const etablissement = await Etablissement.update(req.params.id, req.body);
    if (!etablissement) {
      return res.status(404).json({
        success: false,
        message: 'Établissement non trouvé'
      });
    }
    res.json({
      success: true,
      data: etablissement,
      message: 'Établissement mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'établissement:', error);
    res.status(422).json({
      success: false,
      message: 'Erreur de validation',
      errors: [error.message]
    });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Etablissement.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Établissement non trouvé'
      });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'établissement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      errors: [error.message]
    });
  }
});

module.exports = router;