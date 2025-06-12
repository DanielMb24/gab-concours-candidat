
const { getConnection } = require('../config/database');

class Candidat {
  static async create(candidatData) {
    const connection = getConnection();
    
    // Générer un numéro de candidature unique
    const nupcan = `CONC2024${Date.now().toString().slice(-6)}`;
    
    const [result] = await connection.execute(
      `INSERT INTO candidats (niveau_id, nipcan, nomcan, prncan, maican, dtncan, nupcan, telcan, phtcan, proorg, proact, proaff, ldncan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        candidatData.niveau_id,
        candidatData.nipcan || null,
        candidatData.nomcan,
        candidatData.prncan,
        candidatData.maican,
        candidatData.dtncan,
        nupcan,
        candidatData.telcan,
        candidatData.phtcan || null,
        candidatData.proorg,
        candidatData.proact,
        candidatData.proaff,
        candidatData.ldncan
      ]
    );

    return { id: result.insertId, nupcan, ...candidatData };
  }

  static async findById(id) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT c.*, n.nomniv as niveau_nomniv 
       FROM candidats c 
       LEFT JOIN niveaux n ON c.niveau_id = n.id 
       WHERE c.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async findByNip(nip) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT c.*, n.nomniv as niveau_nomniv 
       FROM candidats c 
       LEFT JOIN niveaux n ON c.niveau_id = n.id 
       WHERE c.nipcan = ?`,
      [nip]
    );
    return rows[0] || null;
  }

  static async update(id, candidatData) {
    const connection = getConnection();
    const fields = Object.keys(candidatData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(candidatData), id];

    await connection.execute(
      `UPDATE candidats SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async getParticipations(candidatId) {
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
}

module.exports = Candidat;
