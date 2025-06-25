
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const Candidat = require('../models/Candidat');
const router = express.Router();

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
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'), false);
    }
  }
});

// POST /api/dossiers - Upload de documents
router.post('/', upload.array('documents', 10), async (req, res) => {
  try {
    const { concours_id, nipcan } = req.body;

    console.log('Données reçues:', { concours_id, nipcan, filesCount: req.files?.length });

    if (!concours_id || !nipcan) {
      return res.status(400).json({
        success: false,
        message: 'Concours ID et NIP candidat requis',
        errors: ['concours_id et nipcan sont obligatoires']
      });
    }

    // Rechercher le candidat par son NUPCAN au lieu du NIP
    let candidat;
    try {
      candidat = await Candidat.findByNupcan(nipcan);
    } catch (error) {
      console.log('Erreur recherche par NUPCAN, tentative par NIP:', error.message);
      candidat = await Candidat.findByNip(nipcan);
    }

    if (!candidat) {
      console.log('Candidat non trouvé avec NIP/NUPCAN:', nipcan);
      return res.status(404).json({
        success: false,
        message: 'Candidat introuvable',
        errors: ['Candidat avec ce NIP/NUPCAN introuvable']
      });
    }

    console.log('Candidat trouvé:', candidat);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun document fourni',
        errors: ['Au moins un document est requis']
      });
    }

    // Traitement des fichiers et enregistrement en base
    const savedDocuments = [];

    for (const file of req.files) {
      // Extraire le type de document du nom du fichier
      const fileName = file.originalname;
      let documentType = 'document'; // Type par défaut

      // Déterminer le type basé sur le nom du fichier
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

      console.log('Traitement du fichier:', {
        originalName: fileName,
        type: documentType,
        filename: file.filename
      });

      // Enregistrer le document en base de données
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

    console.log(`${savedDocuments.length} documents enregistrés pour le candidat ${nipcan}`);

    res.status(201).json({ 
      success: true, 
      data: savedDocuments, 
      message: `${savedDocuments.length} documents uploadés et enregistrés avec succès`,
      candidat_id: candidat.id
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload et enregistrement:', error);
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

    res.json({
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
    res.json({
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

    res.json({
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
