const express = require('express');
const router = express.Router();
const pool = require('../db');

// Créer la table si elle n'existe pas
router.get('/init', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS enseignant (
        matricule VARCHAR(20) PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        taux_horaire NUMERIC(10,2) NOT NULL,
        nombre_heures NUMERIC(10,2) NOT NULL
      )
    `);
    res.json({ message: 'Table créée avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — Liste tous les enseignants
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT *, (taux_horaire * nombre_heures) AS prestation FROM enseignant ORDER BY matricule'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — Ajouter un enseignant
router.post('/', async (req, res) => {
  const { matricule, nom, taux_horaire, nombre_heures } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO enseignant (matricule, nom, taux_horaire, nombre_heures) VALUES ($1,$2,$3,$4) RETURNING *',
      [matricule, nom, taux_horaire, nombre_heures]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT — Modifier un enseignant
router.put('/:matricule', async (req, res) => {
  const { matricule } = req.params;
  const { nom, taux_horaire, nombre_heures } = req.body;
  try {
    const result = await pool.query(
      'UPDATE enseignant SET nom=$1, taux_horaire=$2, nombre_heures=$3 WHERE matricule=$4 RETURNING *',
      [nom, taux_horaire, nombre_heures, matricule]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — Supprimer un enseignant
router.delete('/:matricule', async (req, res) => {
  const { matricule } = req.params;
  try {
    await pool.query('DELETE FROM enseignant WHERE matricule=$1', [matricule]);
    res.json({ message: 'Supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;