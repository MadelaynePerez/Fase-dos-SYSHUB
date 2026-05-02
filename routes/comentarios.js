const express = require("express");
const router = express.Router();
const db = require("../Database");

// Cear comentarios 
router.post("/", (req, res) => {
  const { contenido, id_usuario, id_foro } = req.body;

  const sql = `
    INSERT INTO comentarios (contenido, id_usuario, id_foro)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [contenido, id_usuario, id_foro], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Comentario agregado");
  });
});

// coemntarios dpor foro
router.get("/:id_foro", (req, res) => {
  const sql = `
    SELECT c.*, u.nombre AS nombre_usuario
    FROM comentarios c
    LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
    WHERE c.id_foro = ?
    ORDER BY c.fecha_creacion ASC
  `;
  db.query(sql, [req.params.id_foro], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});


router.delete("/:id", (req, res) => {
  db.query("DELETE FROM comentarios WHERE id_comentario=?", [req.params.id],
    (err) => { if (err) return res.status(500).send(err); res.send("OK"); });
});

module.exports = router;