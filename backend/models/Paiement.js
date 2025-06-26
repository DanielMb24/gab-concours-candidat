
const { getConnection } = require('../config/database');

class Paiement {
  static async create(paiementData) {
    const connection = getConnection();
    
    // Générer une référence unique
    const reference = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const [result] = await connection.execute(
      `INSERT INTO paiements (candidat_id, mntfrai, datfrai, montant, reference, statut, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        paiementData.candidat_id,
        paiementData.mntfrai,
        paiementData.datfrai,
        paiementData.montant || paiementData.mntfrai,
        reference,
        paiementData.statut || 'en_attente'
      ]
    );

    return { id: result.insertId, reference, ...paiementData };
  }

  static async findById(id) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM paiements WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async findByCandidat(candidatId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM paiements WHERE candidat_id = ? ORDER BY created_at DESC',
      [candidatId]
    );
    return rows;
  }

  static async findByParticipation(participationId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT p.* FROM paiements p
       JOIN participations pa ON p.candidat_id = pa.candidat_id
       WHERE pa.id = ?`,
      [participationId]
    );
    return rows[0] || null;
  }

  static async validate(id) {
    const connection = getConnection();
    await connection.execute(
      'UPDATE paiements SET statut = ?, updated_at = NOW() WHERE id = ?',
      ['valide', id]
    );

    return this.findById(id);
  }

  static async findAll() {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT p.*, c.nomcan, c.prncan, c.nipcan, c.nupcan, co.libcnc
       FROM paiements p
       LEFT JOIN candidats c ON p.candidat_id = c.id
       LEFT JOIN concours co ON c.concours_id = co.id
       ORDER BY p.created_at DESC`
    );
    return rows;
  }
}

module.exports = Paiement;
