const express = require("express");
const router = express.Router();
const db = require("../Database");

router.post("/", (req, res) => {
  const { tipo, id_referencia, id_usuario, valor } = req.body;
  const sql = `
    INSERT INTO votos (tipo, id_referencia, id_usuario, valor)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE valor = ?
  `;
  db.query(sql, [tipo, id_referencia, id_usuario, valor, valor],
    (err) => { if (err) return res.status(500).send(err); res.send("OK"); });
});

// Obtener votos de un contenido
router.get("/:tipo/:id", (req, res) => {
  const sql = `
    SELECT SUM(valor) AS total, COUNT(*) AS cantidad
    FROM votos WHERE tipo=? AND id_referencia=?
  `;
  db.query(sql, [req.params.tipo, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]);
  });
});

module.exports = router;