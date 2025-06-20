
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
    
    // Générer le numéro unique de candidature
    const nupcan = generateNupcan();
    
    // Créer le candidat
    const candidatData = {
      niveau_id: req.body.niveau_id,
      nipcan: req.body.nipcan || null,
      nomcan: req.body.nomcan,
      prncan: req.body.prncan,
      maican: req.body.maican,
      dtncan: req.body.dtncan,
      telcan: req.body.telcan,
      phtcan: req.file ? req.file.path : req.body.phtcan,
      proorg: req.body.proorg,
      proact: req.body.proact || req.body.proorg,
      proaff: req.body.proaff || req.body.proorg,
      ldncan: req.body.ldncan,
      nupcan: nupcan
    };

    const candidat = await Candidat.create(candidatData);
    
    // Créer la participation si concours_id est fourni
    let participation = null;
    if (req.body.concours_id) {
      const participationData = {
        candidat_id: candidat.id,
        concours_id: req.body.concours_id,
        stspar: 1,
        statut: 'inscrit'
      };
      participation = await Participation.create(participationData);
    }

    res.status(201).json({ 
      success: true, 
      data: {
        ...candidat.toJSON(),
        participation: participation
      }, 
      message: 'Étudiant créé avec succès' 
    });
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
