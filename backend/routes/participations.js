const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Participation = require('../models/Participation');

router.get('/:id', authenticateToken, async (req, res) =>{

try {
  const participation = await Participation.findById(req.params.id);
  if (!participation) {
    return res.status(404).json({
      success: false,
      message: 'Participation non trouvée'
    });
  }
  res.json({ success: true, data: participation });
} catch (error) {
  console.error('Erreur lors de la récupération de la participation:', error);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    errors: [error.message]
  });
}
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const participation = await Participation.create(req.body);
    res.status(201).json({
      success: true,
      data: participation,
      message: 'Participation créée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création de la participation:', error);
    res.status(422).json({
      success: false,
      message: 'Erreur de validation',
      errors: [error.message]
    });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const participation = await Participation.update(req.params.id, req.body);
    if (!participation) {
      return res.status(404).json({
        success: false,
        message: 'Participation non trouvée'
      });
    }
    res.json({
      success: true,
      data: participation,
      message: 'Participation mise à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la participation:', error);
    res.status(422).json({
      success: false,
      message: 'Erreur de validation',
      errors: [error.message]
    });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Participation.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Participation non trouvée'
      });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de la participation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      errors: [error.message]
    });
  }
});

module.exports = router;