
const { getConnection } = require('../config/database');

class CandidatExtended {
  // Ajouter la méthode findByNupcan manquante
  static async findByNupcan(nupcan) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM candidats WHERE nupcan = ?',
      [nupcan]
    );
    return rows[0] || null;
  }

  // Méthode pour mettre à jour le modèle Candidat existant
  static extendCandidatModel(CandidatModel) {
    CandidatModel.findByNupcan = this.findByNupcan;
    return CandidatModel;
  }
}

module.exports = CandidatExtended;
