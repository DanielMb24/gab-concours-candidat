
const { getConnection } = require('../config/database');

class Participation {
  static async create(participationData) {
    const connection = getConnection();
    
    // Générer un numéro de candidature unique
    const numero_candidature = `CONC2024${Date.now().toString().slice(-6)}`;
    
    const [result] = await connection.execute(
      `INSERT INTO participations (candidat_id, concours_id, stspar, numero_candidature, statut)
       VALUES (?, ?, ?, ?, ?)`,
      [
        participationData.candidat_id,
        participationData.concours_id,
        participationData.stspar || 1,
        numero_candidature,
        participationData.statut || 'inscrit'
      ]
    );

    return { id: result.insertId, numero_candidature, ...participationData };
  }

  static async findById(id) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT p.*, c.libcnc, e.nomets, ca.nomcan, ca.prncan
       FROM participations p
       LEFT JOIN concours c ON p.concours_id = c.id
       LEFT JOIN etablissements e ON c.etablissement_id = e.id
       LEFT JOIN candidats ca ON p.candidat_id = ca.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async findByNumero(numero) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT p.*, c.libcnc, e.nomets, ca.nomcan, ca.prncan
       FROM participations p
       LEFT JOIN concours c ON p.concours_id = c.id
       LEFT JOIN etablissements e ON c.etablissement_id = e.id
       LEFT JOIN candidats ca ON p.candidat_id = ca.id
       WHERE p.numero_candidature = ?`,
      [numero]
    );
    return rows[0] || null;
  }

  static async findByCandidatId(candidatId) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT p.*, c.libcnc, e.nomets
       FROM participations p
       LEFT JOIN concours c ON p.concours_id = c.id
       LEFT JOIN etablissements e ON c.etablissement_id = e.id
       WHERE p.candidat_id = ?`,
      [candidatId]
    );
    return rows;
  }

  static async update(id, participationData) {
    const connection = getConnection();
    const fields = Object.keys(participationData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(participationData), id];

    await connection.execute(
      `UPDATE participations SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    return this.findById(id);
  }
}

module.exports = Participation;
