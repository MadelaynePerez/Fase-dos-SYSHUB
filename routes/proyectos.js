const express = require("express");
const router = express.Router();
const db = require("../Database");
const multer = require("multer");
const path = require("path");


// CONFIGURACIOn
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// CREAR PROYECTOSs
router.post("/", upload.any(), (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);

  const { titulo, descripcion, stack_tecnologico, id_usuario, tags } = req.body;

  const archivo = req.files && req.files.length > 0 
    ? req.files[0].filename 
    : null;

  const sql = `
    INSERT INTO proyectos (titulo, descripcion, archivo, stack_tecnologico,tags, id_usuario)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [titulo, descripcion, archivo, stack_tecnologico,tags, id_usuario], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Proyecto con archivo creado");
  });
});


// OBTENER PROYECTOS
router.get("/", (req, res) => {
  const sql = `
    SELECT p.*, u.nombre AS nombre_usuario 
    FROM proyectos p
    LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
    ORDER BY p.fecha_creacion DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

router.put("/:id/destacar", (req, res) => {
  const { destacado } = req.body;
  db.query(
    "UPDATE proyectos SET destacado=? WHERE id_proyecto=?",
    [destacado, req.params.id],
    (err) => { if (err) return res.status(500).send(err); res.send("OK"); }
  );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, stack_tecnologico } = req.body;

  const sql = `
    UPDATE proyectos 
    SET titulo=?, descripcion=?, stack_tecnologico=? 
    WHERE id_proyecto=?
  `;

  db.query(sql, [titulo, descripcion, stack_tecnologico, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Proyecto actualizado");
  });
});



router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM proyectos WHERE id_proyecto=?";

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Proyecto eliminado");
  });
});

module.exports = router;