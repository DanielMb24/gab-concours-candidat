
const { getConnection } = require('../config/database');

class Counter {
  static async getNextNupcan() {
    const connection = getConnection();
    
    // Obtenir la date actuelle
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateKey = `${month}-${day}`;
    
    try {
      // Vérifier s'il y a déjà un compteur pour aujourd'hui
      const [existing] = await connection.execute(
        'SELECT counter FROM nupcan_counters WHERE date_key = ?',
        [dateKey]
      );
      
      if (existing.length > 0) {
        // Incrémenter le compteur existant
        const newCounter = existing[0].counter + 1;
        await connection.execute(
          'UPDATE nupcan_counters SET counter = ? WHERE date_key = ?',
          [newCounter, dateKey]
        );
        return `GABCONCOURS-${dateKey}-${newCounter}`;
      } else {
        // Créer un nouveau compteur pour aujourd'hui
        await connection.execute(
          'INSERT INTO nupcan_counters (date_key, counter) VALUES (?, ?)',
          [dateKey, 1]
        );
        return `GABCONCOURS-${dateKey}-1`;
      }
    } catch (error) {
      // Si la table n'existe pas, créer la table et retourner le premier NUPCAN
      if (error.code === 'ER_NO_SUCH_TABLE') {
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS nupcan_counters (
            id INT AUTO_INCREMENT PRIMARY KEY,
            date_key VARCHAR(10) NOT NULL UNIQUE,
            counter INT NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);
        
        await connection.execute(
          'INSERT INTO nupcan_counters (date_key, counter) VALUES (?, ?)',
          [dateKey, 1]
        );
        return `GABCONCOURS-${dateKey}-1`;
      }
      throw error;
    }
  }
}

module.exports = Counter;
