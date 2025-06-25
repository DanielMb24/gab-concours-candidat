
const { getConnection } = require('../config/database');

class Document {
  static async create(documentData) {
    const connection = getConnection();
    
    const [result] = await connection.execute(
      `INSERT INTO documents (candidat_id, concours_id, nomdoc, type, nom_fichier, statut, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        documentData.candidat_id,
        documentData.concours_id,
        documentData.nomdoc,
        documentData.type,
        documentData.nom_fichier,
        documentData.statut || 'en_attente'
      ]
    );

    return { id: result.insertId, ...documentData };
  }

  static async findByCandidat(candidatId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM documents WHERE candidat_id = ? ORDER BY created_at DESC',
      [candidatId]
    );
    return rows;
  }

  static async findByConcours(concoursId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM documents WHERE concours_id = ? ORDER BY created_at DESC',
      [concoursId]
    );
    return rows;
  }

  static async updateStatus(id, statut) {
    const connection = getConnection();
    await connection.execute(
      'UPDATE documents SET statut = ?, updated_at = NOW() WHERE id = ?',
      [statut, id]
    );

    return this.findById(id);
  }

  static async findById(id) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM documents WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async deleteById(id) {
    const connection = getConnection();
    await connection.execute('DELETE FROM documents WHERE id = ?', [id]);
    return true;
  }

  static async findAll() {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT d.*, c.nomcan, c.prncan, c.nipcan, c.nupcan, co.libcnc
       FROM documents d
       LEFT JOIN candidats c ON d.candidat_id = c.id
       LEFT JOIN concours co ON d.concours_id = co.id
       ORDER BY d.created_at DESC`
    );
    return rows;
  }
}

module.exports = Document;
