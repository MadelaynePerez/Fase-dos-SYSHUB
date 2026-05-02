const express = require("express");
const router = express.Router();
const db = require("../Database");

router.get("/", (req, res) => {
  const sql = `
    SELECT a.*, u.nombre AS nombre_usuario
    FROM articulos a
    LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
    ORDER BY a.fecha_publicacion DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

router.post("/", (req, res) => {
  const { titulo, contenido, tipo, id_usuario } = req.body;
  db.query(
    "INSERT INTO articulos (titulo, contenido, tipo, id_usuario) VALUES (?,?,?,?)",
    [titulo, contenido, tipo, id_usuario],
    (err) => { if (err) return res.status(500).send(err); res.send("OK"); }
  );
});

router.delete("/:id", (req, res) => {
  db.query("DELETE FROM articulos WHERE id_articulo=?", [req.params.id],
    (err) => { if (err) return res.status(500).send(err); res.send("OK"); });
});

module.exports = router;