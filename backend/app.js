const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const sauceRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");
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

app.use("/api/", sauceRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
module.exports = app;
