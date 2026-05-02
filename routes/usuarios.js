const express = require("express");
const router = express.Router();
const db = require("../Database");

// listar a los usuarios
router.get("/", (req, res) => {
  const sql = `
    SELECT u.*, r.nombre AS nombre_rol
    FROM usuarios u
    LEFT JOIN roles r ON u.id_rol = r.id_rol
    ORDER BY u.fecha_creacion DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Eedit a usuairos 
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, email, id_rol } = req.body; 

  const sql = "UPDATE usuarios SET nombre=?, email=?, id_rol=? WHERE id_usuario=?";

  db.query(sql, [nombre, email, id_rol, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Usuario actualizado");
  });
});
//suspenderr susuario
router.put("/:id/suspender", (req, res) => {
  const { suspendido } = req.body;
  db.query(
    "UPDATE usuarios SET suspendido=? WHERE id_usuario=?",
    [suspendido, req.params.id],
    (err) => { if (err) return res.status(500).send(err); res.send("OK"); }
  );
});

// eliminar usuarioo
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM usuarios WHERE id_usuario=?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Usuario eliminado");
  });
});

module.exports = router;