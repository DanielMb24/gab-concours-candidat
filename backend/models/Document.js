const { getConnection } = require('../config/database');

class Document {
  static async create(documentData) {
    const connection = getConnection();
    let documentId;

    try {
      await connection.beginTransaction();

      const [documentResult] = await connection.execute(
          `INSERT INTO document (nomdoc, type, nom_fichier, statut, created_at, updated_at)
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
          [
            documentData.nomdoc,
            documentData.type,
            documentData.nom_fichier,
            documentData.statut || 'en_attente'
          ]
      );
      documentId = documentResult.insertId;

      const [dossierResult] = await connection.execute(
          `INSERT INTO dossiers (candidat_id, concours_id, document_id, statut, created_at, updated_at)
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
          [
            documentData.candidat_id,
            documentData.concours_id,
            documentId,
            documentData.statut || 'en_attente'
          ]
      );

      await connection.commit();

      return {
        id: dossierResult.insertId,
        document_id: documentId,
        ...documentData
      };
    } catch (error) {
      await connection.rollback();
      console.error('Erreur lors de la création du document:', error);
      throw new Error(`Erreur SQL: ${error.message}`);
    }
  }

  static async findByCandidat(candidatId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
        `SELECT d.*, doc.nomdoc, doc.type, doc.nom_fichier
       FROM dossiers d
       JOIN document doc ON d.document_id = doc.document_id
       WHERE d.candidat_id = ? ORDER BY d.created_at DESC`,
        [candidatId]
    );
    return rows;
  }

  static async findByConcours(concoursId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
        `SELECT d.*, doc.nomdoc, doc.type, doc.nom_fichier
       FROM dossiers d
       JOIN document doc ON d.document_id = doc.document_id
       WHERE d.concours_id = ? ORDER BY d.created_at DESC`,
        [concoursId]
    );
    return rows;
  }

  static async updateStatus(id, statut) {
    const connection = getConnection();
    await connection.execute(
        'UPDATE dossiers SET statut = ?, updated_at = NOW() WHERE id = ?',
        [statut, id]
    );

    return this.findById(id);
  }

  static async findById(id) {
    const connection = getConnection();
    const [rows] = await connection.execute(
        `SELECT d.*, doc.nomdoc, doc.type, doc.nom_fichier
       FROM dossiers d
       JOIN document doc ON d.document_id = doc.document_id
       WHERE d.id = ?`,
        [id]
    );
    return rows[0] || null;
  }

  static async deleteById(id) {
    const connection = getConnection();
    await connection.execute('DELETE FROM dossiers WHERE id = ?', [id]);
    return true;
  }

  static async findAll() {
    const connection = getConnection();
    const [rows] = await connection.execute(
        `SELECT d.*, c.nomcan, c.prncan, c.nipcan, c.nupcan, co.libcnc, doc.nomdoc, doc.type, doc.nom_fichier
       FROM dossiers d
       LEFT JOIN candidats c ON d.candidat_id = c.id
       LEFT JOIN concours co ON d.concours_id = co.id
       JOIN document doc ON d.document_id = doc.document_id
       ORDER BY d.created_at DESC`
    );
    return rows;
  }
}

module.exports = Document;