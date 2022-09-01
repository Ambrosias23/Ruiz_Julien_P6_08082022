const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const dotenv = require('dotenv');
dotenv.config();
const helmet = require('helmet');

const saucesRoutes = require("./routes/sauces");
const usersRoutes = require("./routes/users");
const path = require("path");

mongoose
.connect(
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority`,
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
// MongoSanitize, security
app.use(mongoSanitize({ 
	replaceWith : '_',
}));
// Express-rate-limit, security
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: "Too many request from this IP"
});
app.use(limiter);

app.use(helmet({crossOriginResourcePolicy: false}));
app.disable('x-powered-by');

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", usersRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
module.exports = app;
