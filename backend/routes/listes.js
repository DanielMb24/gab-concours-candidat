const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Liste = require('../models/Liste');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const listes = await Liste.findAll();
        res.json({ success: true, data: listes });
    } catch (error) {
        console.error('Erreur lors de la récupération des listes:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            errors: [error.message]
        });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const liste = await Liste.findById(req.params.id);
        if (!liste) {
            return res.status(404).json({
                success: false,
                message: 'Liste non trouvée'
            });
        }
        res.json({ success: true, data: liste });
    } catch (error) {
        console.error('Erreur lors de la récupération de la liste:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            errors: [error.message]
        });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const liste = await Liste.create(req.body);
        res.status(201).json({
            success: true,
            data: liste,
            message: 'Liste créée avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la création de la liste:', error);
        res.status(422).json({
            success: false,
            message: 'Erreur de validation',
            errors: [error.message]
        });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const liste = await Liste.update(req.params.id, req.body);
        if (!liste) {
            return res.status(404).json({
                success: false,
                message: 'Liste non trouvée'
            });
        }
        res.json({
            success: true,
            data: liste,
            message: 'Liste mise à jour avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la liste:', error);
        res.status(422).json({
            success: false,
            message: 'Erreur de validation',
            errors: [error.message]
        });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const deleted = await Liste.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Liste non trouvée'
            });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Erreur lors de la suppression de la liste:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            errors: [error.message]
        });
    }
});

module.exports = router;