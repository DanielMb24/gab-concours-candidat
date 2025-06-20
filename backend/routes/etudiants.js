
const express = require('express');
const multer = require('multer');
const router = express.Router();
const Candidat = require('../models/Candidat');
const Participation = require('../models/Participation');

// Configuration multer pour l'upload de fichiers
const upload = multer({ dest: 'uploads/' });

// Fonction pour générer le numéro unique de candidature
function generateNupcan() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `GABCONCOURS${year}/${month}/${day}/${random}`;
}

// POST /api/etudiants - Créer un étudiant complet avec participation
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    console.log('Données reçues:', req.body);

    // Validation des champs requis
    if (!req.body.nomcan || !req.body.prncan || !req.body.maican || !req.body.telcan || 
        !req.body.dtncan || !req.body.proorg || !req.body.ldncan || !req.body.niveau_id) {
      return res.status(400).json({
        success: false,
        message: 'Champs requis manquants',
        errors: ['Tous les champs obligatoires doivent être remplis']
      });
    }

    // Générer le numéro unique de candidature
    const nupcan = generateNupcan();

    // Créer le candidat
    const candidatData = {
      niveau_id: parseInt(req.body.niveau_id),
      nipcan: req.body.nipcan || null,
      nomcan: req.body.nomcan,
      prncan: req.body.prncan,
      maican: req.body.maican,
      dtncan: req.body.dtncan,
      telcan: req.body.telcan,
      phtcan: req.file ? req.file.path : req.body.phtcan,
      proorg: parseInt(req.body.proorg),
      proact: parseInt(req.body.proact) || parseInt(req.body.proorg),
      proaff: parseInt(req.body.proaff) || parseInt(req.body.proorg),
      ldncan: req.body.ldncan,
      nupcan: nupcan
    };

    console.log('Données candidat à créer:', candidatData);

    const candidat = await Candidat.create(candidatData);
    console.log('Candidat créé:', candidat);

    // Créer la participation si concours_id est fourni
    let participation = null;
    if (req.body.concours_id) {
      const participationData = {
        candidat_id: candidat.id,
        concours_id: parseInt(req.body.concours_id),
        stspar: 1,
        statut: 'inscrit'
      };
      console.log('Données participation à créer:', participationData);
      participation = await Participation.create(participationData);
      console.log('Participation créée:', participation);
    }

    // Retourner la réponse
    const response = {
      success: true,
      data: {
        ...candidat,
        participation: participation
      },
      message: 'Étudiant créé avec succès'
    };

    console.log('Réponse envoyée:', response);
    res.status(201).json(response);

  } catch (error) {
    console.error('Erreur lors de la création de l\'étudiant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      errors: [error.message]
    });
  }
});

module.exports = router;
