
const mysql = require('mysql2/promise');
require('dotenv').config();

const initDatabase = async () => {
  try {
    // Connexion sans base de données pour la créer
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    // Créer la base de données si elle n'existe pas
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'gabconcours'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('✅ Base de données créée ou existe déjà');

    // Se connecter à la base de données
    await connection.changeUser({ database: process.env.DB_NAME || 'gabconcours' });

    // Créer les tables
    const tables = [
      // Table provinces
      `CREATE TABLE IF NOT EXISTS provinces (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nompro VARCHAR(100) NOT NULL,
        cdepro VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Table niveaux
      `CREATE TABLE IF NOT EXISTS niveaux (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nomniv VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Table etablissements
      `CREATE TABLE IF NOT EXISTS etablissements (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nomets VARCHAR(200) NOT NULL,
        adresse TEXT,
        telephone VARCHAR(20),
        email VARCHAR(100),
        photo VARCHAR(255),
        province_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (province_id) REFERENCES provinces(id)
      )`,

      // Table concours
      `CREATE TABLE IF NOT EXISTS concours (
        id INT PRIMARY KEY AUTO_INCREMENT,
        etablissement_id INT NOT NULL,
        niveau_id INT NOT NULL,
        libcnc VARCHAR(200) NOT NULL,
        sescnc VARCHAR(10) NOT NULL,
        debcnc DATETIME NOT NULL,
        fincnc DATETIME NOT NULL,
        stacnc ENUM('1', '2', '3') DEFAULT '1',
        agecnc INT NOT NULL,
        fracnc DECIMAL(10,2) NOT NULL,
        etddos ENUM('0', '1') DEFAULT '0',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (etablissement_id) REFERENCES etablissements(id),
        FOREIGN KEY (niveau_id) REFERENCES niveaux(id)
      )`,

      // Table candidats
      `CREATE TABLE IF NOT EXISTS candidats (
        id INT PRIMARY KEY AUTO_INCREMENT,
        niveau_id INT NOT NULL,
        nipcan VARCHAR(20) UNIQUE,
        nomcan VARCHAR(100) NOT NULL,
        prncan VARCHAR(100) NOT NULL,
        maican VARCHAR(150) NOT NULL,
        dtncan DATE NOT NULL,
        nupcan VARCHAR(50),
        telcan VARCHAR(20) NOT NULL,
        phtcan VARCHAR(255),
        proorg INT NOT NULL,
        proact INT NOT NULL,
        proaff INT NOT NULL,
        ldncan VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (niveau_id) REFERENCES niveaux(id),
        FOREIGN KEY (proorg) REFERENCES provinces(id),
        FOREIGN KEY (proact) REFERENCES provinces(id),
        FOREIGN KEY (proaff) REFERENCES provinces(id)
      )`,

      // Table participations
      `CREATE TABLE IF NOT EXISTS participations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        candidat_id INT NOT NULL,
        concours_id INT NOT NULL,
        stspar INT DEFAULT 1,
        numero_candidature VARCHAR(50) UNIQUE,
        statut ENUM('inscrit', 'paye', 'valide', 'en_attente') DEFAULT 'inscrit',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (candidat_id) REFERENCES candidats(id),
        FOREIGN KEY (concours_id) REFERENCES concours(id)
      )`,

      // Table documents
      `CREATE TABLE IF NOT EXISTS documents (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nomdoc VARCHAR(200) NOT NULL,
        type VARCHAR(50),
        nom_fichier VARCHAR(255),
        statut ENUM('en_attente', 'valide', 'rejete') DEFAULT 'en_attente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Table dossiers
      `CREATE TABLE IF NOT EXISTS dossiers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        concours_id INT NOT NULL,
        docdsr VARCHAR(255) NOT NULL,
        document_id INT NOT NULL,
        nipcan VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (concours_id) REFERENCES concours(id),
        FOREIGN KEY (document_id) REFERENCES documents(id)
      )`,

      // Table paiements
      `CREATE TABLE IF NOT EXISTS paiements (
        id INT PRIMARY KEY AUTO_INCREMENT,
        candidat_id INT NOT NULL,
        mntfrai DECIMAL(10,2) NOT NULL,
        datfrai DATETIME NOT NULL,
        montant DECIMAL(10,2),
        reference VARCHAR(100),
        statut ENUM('en_attente', 'valide', 'rejete') DEFAULT 'en_attente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (candidat_id) REFERENCES candidats(id)
      )`,

      // Table sessions
      `CREATE TABLE IF NOT EXISTS sessions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        candidat_id INT NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (candidat_id) REFERENCES candidats(id)
      )`
    ];

    for (const table of tables) {
      await connection.execute(table);
    }

    console.log('✅ Tables créées avec succès');

    // Insérer des données de test
    await insertSampleData(connection);

    await connection.end();
    console.log('✅ Initialisation terminée');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  }
};

const insertSampleData = async (connection) => {
  try {
    // Provinces
    await connection.execute(`
      INSERT IGNORE INTO provinces (id, nompro, cdepro) VALUES
      (1, 'Estuaire', 'EST'),
      (2, 'Haut-Ogooué', 'HOG'),
      (3, 'Moyen-Ogooué', 'MOG'),
      (4, 'Ngounié', 'NGO'),
      (5, 'Nyanga', 'NYA'),
      (6, 'Ogooué-Ivindo', 'OIV'),
      (7, 'Ogooué-Lolo', 'OLO'),
      (8, 'Ogooué-Maritime', 'OMA'),
      (9, 'Woleu-Ntem', 'WNT')
    `);

    // Niveaux
    await connection.execute(`
      INSERT IGNORE INTO niveaux (id, nomniv, description) VALUES
      (1, 'Licence', 'Niveau Licence'),
      (2, 'Master', 'Niveau Master'),
      (3, 'Doctorat', 'Niveau Doctorat'),
      (9, 'Baccalauréat', 'Niveau Baccalauréat')
    `);

    // Etablissements
    await connection.execute(`
      INSERT IGNORE INTO etablissements (id, nomets, adresse, telephone, email, photo, province_id) VALUES
      (1, 'Université Omar Bongo', 'Libreville', '+241 01 02 03 04', 'contact@uob.ga', 'uob.jpg', 1),
      (2, 'École Normale Supérieure', 'Libreville', '+241 01 02 03 05', 'contact@ens.ga', 'ens.jpg', 1),
      (3, 'Institut Polytechnique', 'Franceville', '+241 01 02 03 06', 'contact@polytechnique.ga', 'poly.jpg', 2)
    `);

    // Concours
    await connection.execute(`
      INSERT IGNORE INTO concours (id, etablissement_id, niveau_id, libcnc, sescnc, debcnc, fincnc, stacnc, agecnc, fracnc, etddos) VALUES
      (1, 1, 9, 'Concours d\'entrée en première année', '2024', '2024-02-10 10:23:55', '2024-12-23 23:59:59', '1', 21, 50000, '0'),
      (2, 2, 1, 'Concours de recrutement ENS', '2024', '2024-03-01 08:00:00', '2024-11-30 18:00:00', '1', 25, 75000, '0')
    `);

    console.log('✅ Données de test insérées');
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des données:', error);
  }
};

// Exécuter l'initialisation si le script est appelé directement
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };
