const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const Candidat = require('../models/Candidat');
const CandidatExtended = require('../models/CandidatExtended');
const router = express.Router();

// Étendre le modèle Candidat avec les méthodes supplémentaires
CandidatExtended.extendCandidatModel(Candidat);

// Configuration multer pour l'upload de documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/documents';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    console.log('Multer fileFilter:', { mimetype: file.mimetype, originalname: file.originalname });
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé: seuls PDF, JPEG, PNG sont acceptés'), false);
    }
  }
}).array('documents', 10);

// Gestion des erreurs Multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Erreur Multer:', err);
    return res.status(400).json({ success: false, message: 'Erreur lors de l\'upload des fichiers', errors: [err.message] });
  } else if (err) {
    console.error('Erreur fichier:', err);
    return res.status(400).json({ success: false, message: 'Erreur lors du traitement des fichiers', errors: [err.message] });
  }
  next();
};

// POST /api/dossiers - Upload de documents
router.post('/', upload, handleMulterError, async (req, res) => {
  try {
    const { concours_id, nupcan } = req.body;

    console.log('Données reçues:', {
      concours_id,
      nupcan,
      filesCount: req.files?.length,
      files: req.files ? req.files.map(f => ({ originalName: f.originalname, filename: f.filename })) : null
    });

    if (!concours_id || isNaN(parseInt(concours_id))) {
      return res.status(400).json({ success: false, message: 'Concours ID invalide', errors: ['concours_id est requis et doit être un nombre'] });
    }
    if (!nupcan || typeof nupcan !== 'string') {
      return res.status(400).json({ success: false, message: 'NUPCAN invalide', errors: ['nupcan est requis et doit être une chaîne'] });
    }

    const candidat = await Candidat.findByNupcan(nupcan);
    if (!candidat || !candidat.id) {
      console.log('Candidat non trouvé ou ID manquant avec NUPCAN:', nupcan);
      return res.status(404).json({ success: false, message: 'Candidat introuvable', errors: ['Candidat avec ce NUPCAN introuvable ou ID manquant'] });
    }
    console.log('Candidat trouvé:', { id: candidat.id, nupcan: candidat.nupcan });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Aucun document fourni', errors: ['Au moins un document est requis'] });
    }

    const savedDocuments = [];

    for (const file of req.files) {
      const fileName = file.originalname;
      let documentType = 'document';

      if (fileName.toLowerCase().includes('cni') || fileName.toLowerCase().includes('carte_identite')) {
        documentType = 'cni';
      } else if (fileName.toLowerCase().includes('diplome') || fileName.toLowerCase().includes('attestation')) {
        documentType = 'diplome';
      } else if (fileName.toLowerCase().includes('photo')) {
        documentType = 'photo';
      } else if (fileName.toLowerCase().includes('acte_naissance') || fileName.toLowerCase().includes('naissance')) {
        documentType = 'acte_naissance';
      } else if (fileName.toLowerCase().includes('autres')) {
        documentType = 'autres';
      }

      console.log('Traitement du fichier:', { originalName: fileName, type: documentType, filename: file.filename });

      const documentData = {
        candidat_id: candidat.id,
        concours_id: parseInt(concours_id),
        nomdoc: file.originalname,
        type: documentType,
        nom_fichier: file.filename,
        statut: 'en_attente'
      };

      console.log('Données du document à insérer:', documentData);

      const savedDocument = await Document.create(documentData);
      savedDocuments.push(savedDocument);
      console.log('Document enregistré:', savedDocument);
    }

    console.log(`${savedDocuments.length} documents enregistrés pour le candidat ${nupcan}`);

    res.status(201).json({
      success: true,
      data: savedDocuments,
      message: `${savedDocuments.length} documents uploadés et enregistrés avec succès`,
      candidat_id: candidat.id
    });
  } catch (error) {
    console.error('Erreur détaillée lors de l\'upload et enregistrement:', {
      message: error.message,
      stack: error.stack,
      concours_id: req.body.concours_id,
      nupcan: req.body.nupcan,
      files: req.files ? req.files.map(f => ({ originalName: f.originalname, filename: f.filename })) : null
    });
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'enregistrement',
      errors: [error.message]
    });
  }
});

// GET /api/dossiers/candidat/:candidatId - Récupérer les documents d'un candidat
router.get('/candidat/:candidatId', async (req, res) => {
  try {
    const { candidatId } = req.params;
    const documents = await Document.findByCandidat(candidatId);

    res.status(200).json({
      success: true,
      data: documents,
      message: 'Documents récupérés avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des documents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      errors: [error.message]
    });
  }
});

// GET /api/dossiers - Récupérer tous les documents avec infos candidats
router.get('/', async (req, res) => {
  try {
    const documents = await Document.findAll();
    res.status(200).json({
      success: true,
      data: documents,
      message: 'Tous les documents récupérés avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des documents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      errors: [error.message]
    });
  }
});

// PUT /api/dossiers/:id/status - Mettre à jour le statut d'un document
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    if (!statut || !['en_attente', 'valide', 'rejete'].includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide',
        errors: ['Le statut doit être: en_attente, valide ou rejete']
      });
    }

    const updatedDocument = await Document.updateStatus(id, statut);

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: 'Document introuvable'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedDocument,
      message: 'Statut du document mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      errors: [error.message]
    });
  }
});

module.exports = router;