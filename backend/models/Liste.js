const { getConnection } = require('../config/database');

class Liste {
    static async create(listeData) {
        const connection = getConnection();
        const [result] = await connection.execute(
            'INSERT INTO listes (nom, created_at, updated_at) VALUES (?, NOW(), NOW())',
            [listeData.nom]
        );
        return { id: result.insertId, ...listeData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    }

    static async findAll() {
        const connection = getConnection();
        const [rows] = await connection.execute('SELECT * FROM listes ORDER BY created_at DESC');
        return rows;
    }

    static async findById(id) {
        const connection = getConnection();
        const [rows] = await connection.execute('SELECT * FROM listes WHERE id = ?', [id]);
        return rows[0] || null;
    }

    static async update(id, listeData) {
        const connection = getConnection();
        const fields = Object.keys(listeData).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(listeData), id];
        await connection.execute(`UPDATE listes SET ${fields}, updated_at = NOW() WHERE id = ?`, values);
        return this.findById(id);
    }

    static async delete(id) {
        const connection = getConnection();
        const [result] = await connection.execute('DELETE FROM listes WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Liste;