const express = require("express");
const path = require("path");
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'Vistas')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/auth", require("./routes/auth"));
app.use("/proyectos", require("./routes/proyectos"));
app.use("/foros", require("./routes/foros"));
app.use("/comentarios", require("./routes/comentarios"));
app.use("/usuarios", require("./routes/usuarios"));
app.use("/votos", require("./routes/votos"));
app.use("/articulos", require("./routes/articulos"));
app.use("/denuncias", require("./routes/denuncias"));
app.use("/categorias", require("./routes/categorias"));



app.get("/", (req, res) => {
  res.send("holis soy anita");
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});