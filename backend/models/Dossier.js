const { getConnection } = require('../config/database');

class Dossier {
    static async create(dossierData) {
        const connection = getConnection();
        const [result] = await connection.execute(
            `INSERT INTO dossiers (candidat_id, concours_id, document_id, statut, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [
                dossierData.candidat_id,
                dossierData.concours_id,
                dossierData.document_id,
                dossierData.statut || 'en_attente'
            ]
        );
        return {
            id: result.insertId,
            ...dossierData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
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

    static async delete(id) {
        const connection = getConnection();
        await connection.execute('DELETE FROM dossiers WHERE id = ?', [id]);
        return true;
    }
}

module.exports = Dossier;