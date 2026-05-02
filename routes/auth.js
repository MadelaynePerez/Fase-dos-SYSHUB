const express = require("express");
const router = express.Router();
const db = require("../Database");
const bcrypt = require("bcrypt");

// REGISTRO
router.post("/register", async (req, res) => {
  const { nombre, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO usuarios (nombre, email, password, id_rol) VALUES (?, ?, ?, 1)";

  db.query(sql, [nombre, email, hash], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Usuario registrado");
  });
});

// LOGIN
router.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length === 0) {
      return res.status(400).send("Usuario no existe");
    }

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).send("Contraseña incorrecta");
    }

    res.json({
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      email: user.email,
      id_rol: user.id_rol
    });

  });
});

router.post("/recuperar", async (req, res) => {
  const { email, password_nueva } = req.body;

  db.query("SELECT * FROM usuarios WHERE email=?", [email], async (err, result) => {
    if (err) return res.status(500).send(err);
    if (!result.length) return res.status(404).send("Correo no registrado");

    const hash = await bcrypt.hash(password_nueva, 10);
    db.query(
      "UPDATE usuarios SET password=? WHERE email=?",
      [hash, email],
      (err) => { if (err) return res.status(500).send(err); res.send("OK"); }
    );
  });
});

module.exports = router;