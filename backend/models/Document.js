
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
      'SELECT * FROM documents WHERE candidat_id = ?',
      [candidatId]
    );
    return rows;
  }

  static async findByConcours(concoursId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM documents WHERE concours_id = ?',
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
}

module.exports = Document;
