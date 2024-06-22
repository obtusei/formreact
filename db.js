// database.js
import sqlite3 from "sqlite3";

const sql = sqlite3.verbose();

// Create a new database or open an existing one
const db = new sql.Database("./database.db", (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create a sample table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS land_survey (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jilla TEXT,
      gabisha TEXT,
      ban_ko_nam TEXT,
      plot_number INTEGER,
      plot_ko_prakar TEXT,
      plot_ko_size INTEGER,
      miti TEXT,
      mohada INTEGER,
      akshyansha REAL,
      desantar INTEGER,
      uchai INTEGER,
      bhiralopan INTEGER,
      ban_ko_prakar TEXT,
      mato_ko_rang TEXT,
      mukhya_prajati TEXT,
      mato_ko_banawat TEXT
    )
  `);

  // Create com_data table
  db.run(`
    CREATE TABLE IF NOT EXISTS species_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      land_survey_id INTEGER,
      staniya TEXT,
      naam TEXT,
      cluster TEXT,
      tilar INTEGER,
      uchai TEXT,
      taja TEXT,
      sukeko TEXT,
      FOREIGN KEY (land_survey_id) REFERENCES land_survey(id)
    )
  `);
});

export default db;
