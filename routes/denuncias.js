const express = require("express");
const router = express.Router();
const db = require("../Database");

router.post("/", (req, res) => {
  const { tipo, id_referencia, id_usuario, motivo } = req.body;
  db.query(
    "INSERT INTO denuncias (tipo, id_referencia, id_usuario, motivo) VALUES (?,?,?,?)",
    [tipo, id_referencia, id_usuario, motivo],
    (err) => { if (err) return res.status(500).send(err); res.send("OK"); }
  );
});

router.get("/", (req, res) => {
  db.query(
    `SELECT d.*, u.nombre AS nombre_denunciante 
     FROM denuncias d
     LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
     ORDER BY d.fecha DESC`,
    (err, result) => { if (err) return res.status(500).send(err); res.json(result); }
  );
});

router.put("/:id", (req, res) => {
  const { estado } = req.body;
  db.query(
    "UPDATE denuncias SET estado=? WHERE id_denuncia=?",
    [estado, req.params.id],
    (err) => { if (err) return res.status(500).send(err); res.send("OK"); }
  );
});

module.exports = router;