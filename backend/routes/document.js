const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Document = require('../models/Document');

// GET /documents
router.get('/', authenticateToken, async (req, res) => {
    const documents = await Document.findAll();
    res.json({ data: documents });
});

// POST /documents
router.post('/', authenticateToken, async (req, res) => {
    const { nomdoc } = req.body;
    try {
        const document = await Document.create({ nomdoc });
        res.json({ data: document });
    } catch (error) {
        res.status(422).json({ message: 'Validation error', errors: { server: [error.message] } });
    }
});

// GET /documents/{id}
router.get('/:id', authenticateToken, async (req, res) => {
    const document = await Document.findByPk(req.params.id);
    if (document) {
        res.json({ data: document });
    } else {
        res.status(404).json({ message: 'Document not found' });
    }
});

// PUT /documents/{id}
router.put('/:id', authenticateToken, async (req, res) => {
    const { nomdoc } = req.body;
    const document = await Document.findByPk(req.params.id);
    if (!document) {
        return res.status(404).json({ message: 'Document not found' });
    }
    try {
        await document.update({ nomdoc });
        res.json({ data: document });
    } catch (error) {
        res.status(422).json({ message: 'Validation error', errors: { server: [error.message] } });
    }
});

// DELETE /documents/{id}
router.delete('/:id', authenticateToken, async (req, res) => {
    const document = await Document.findByPk(req.params.id);
    if (document) {
        await document.destroy();
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Document not found' });
    }
});

module.exports = router;