const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticateToken, csrfMiddleware } = require('../middleware/auth');
const User = require('../models/User');

// POST /login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !await user.validPassword(password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const etablissement = await user.getEtablissement();
        const concours = await user.getConcours();

        res.json({
            access_token: accessToken,
            token_type: 'Bearer',
            user: user.name,
            etablissement: etablissement ? etablissement.nomets : null,
            concours: concours || [],
            status: 'Login successful'
        });
    } catch (error) {
        res.status(422).json({ message: 'Validation error', errors: { server: [error.message] } });
    }
});

// POST /logout
router.post('/logout', authenticateToken, (req, res) => {
    // Invalider le token côté client (le serveur est stateless avec JWT)
    res.json({ message: 'Logout successful' });
});

// GET /TestX
router.get('/TestX', csrfMiddleware, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

module.exports = router;