const express = require("express");
const router = express.Router();
const db = require("../Database");

// CREAR FORO
router.post("/", (req, res) => {
  const { titulo, contenido, id_usuario } = req.body;

  const sql = `
    INSERT INTO foros (titulo, contenido, id_usuario)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [titulo, contenido, id_usuario], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Foro creado");
  });
});

// OBTENER FOROS
router.get("/", (req, res) => {
  const sql = `
    SELECT f.*, u.nombre AS nombre_usuario
    FROM foros f
    LEFT JOIN usuarios u ON f.id_usuario = u.id_usuario
    ORDER BY f.fecha_creacion DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

router.delete("/:id", (req, res) => {
  db.query("DELETE FROM foros WHERE id_foro=?", [req.params.id],
    (err) => { if (err) return res.status(500).send(err); res.send("OK"); });
});

module.exports = router;