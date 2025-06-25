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
      // Commencer une transaction pour éviter les conflits
      await connection.execute('START TRANSACTION');

      // Vérifier s'il y a déjà un compteur pour aujourd'hui
      const [existing] = await connection.execute(
          'SELECT counter FROM nupcan_counters WHERE date_key = ? FOR UPDATE',
          [dateKey]
      );

      let newCounter;
      let nupcan;

      if (existing.length > 0) {
        // Incrémenter le compteur existant
        newCounter = existing[0].counter + 1;
        await connection.execute(
            'UPDATE nupcan_counters SET counter = ?, updated_at = NOW() WHERE date_key = ?',
            [newCounter, dateKey]
        );
        nupcan = `GABCONCOURS-${dateKey}-${newCounter}`;
      } else {
        // Créer un nouveau compteur pour aujourd'hui
        newCounter = 1;
        await connection.execute(
            'INSERT INTO nupcan_counters (date_key, counter, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
            [dateKey, newCounter]
        );
        nupcan = `GABCONCOURS-${dateKey}-${newCounter}`;
      }

      // Valider la transaction
      await connection.execute('COMMIT');

      console.log(`NUPCAN généré: ${nupcan} (compteur: ${newCounter})`);
      return nupcan;

    } catch (error) {
      // Annuler la transaction en cas d'erreur
      await connection.execute('ROLLBACK');

      // Si la table n'existe pas, créer la table et retourner le premier NUPCAN
      if (error.code === 'ER_NO_SUCH_TABLE') {
        console.log('Création de la table nupcan_counters...');
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS nupcan_counters (
            id INT AUTO_INCREMENT PRIMARY KEY,
            date_key VARCHAR(10) NOT NULL UNIQUE,
            counter INT NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_date_key (date_key)
          )
        `);

        await connection.execute(
            'INSERT INTO nupcan_counters (date_key, counter, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
            [dateKey, 1]
        );

        const nupcan = `GABCONCOURS-${dateKey}-1`;
        console.log(`NUPCAN initial généré: ${nupcan}`);
        return nupcan;
      }

      console.error('Erreur lors de la génération du NUPCAN:', error);
      throw error;
    }
  }

  static async resetCounterForDate(dateKey) {
    const connection = getConnection();
    try {
      await connection.execute(
          'DELETE FROM nupcan_counters WHERE date_key = ?',
          [dateKey]
      );
      console.log(`Compteur réinitialisé pour la date: ${dateKey}`);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du compteur:', error);
      throw error;
    }
  }
}

module.exports = Counter;
