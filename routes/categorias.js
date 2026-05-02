const express = require("express");
const router = express.Router();
const db = require("../Database");

router.get("/", (req, res) => {
  db.query("SELECT * FROM categorias ORDER BY nombre", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

router.post("/", (req, res) => {
  const { nombre } = req.body;
  db.query("INSERT INTO categorias (nombre) VALUES (?)", [nombre],
    (err) => { if (err) return res.status(500).send(err); res.send("OK"); }
  );
});

router.delete("/:id", (req, res) => {
  db.query("DELETE FROM categorias WHERE id_categoria=?", [req.params.id],
    (err) => { if (err) return res.status(500).send(err); res.send("OK"); }
  );
});

module.exports = router;