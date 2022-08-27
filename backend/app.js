const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const saucesRoutes = require("./routes/sauces");
const usersRoutes = require("./routes/users");
const path = require("path");

mongoose
  .connect(
    "mongodb+srv://ambrosias23:nCu0mtXXVMae9eRh@cluster0.c2auadu.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());
app.use(bodyParser.json());

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", usersRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
module.exports = app;
