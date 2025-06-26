const { getConnection } = require('../config/database');

class Document {
  static async create(documentData) {
    const connection = getConnection();
    const [result] = await connection.execute(
        `INSERT INTO documents (nomdoc, type, nom_fichier, statut, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [
          documentData.nomdoc,
          documentData.type,
          documentData.nom_fichier,
          documentData.statut || 'en_attente'
        ]
    );
    return {
      id: result.insertId,
      ...documentData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  static async findByCandidat(candidatId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
        `SELECT d.*, doc.nomdoc, doc.type, doc.nom_fichier
       FROM dossiers d
       JOIN documents doc ON d.document_id = doc.id
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
       JOIN documents doc ON d.document_id = doc.id
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
       JOIN documents doc ON d.document_id = doc.id
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
       JOIN documents doc ON d.document_id = doc.id
       ORDER BY d.created_at DESC`
    );
    return rows;
  }
}

module.exports = Document;