const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const stuffCtrl = require("../controllers/stuff");

router.get("/sauces ", auth, stuffCtrl.getAllSauce);
router.post("/sauces", auth, multer, stuffCtrl.createSauce);
router.get("/api/sauces/:id ", auth, stuffCtrl.getOneSauce);
router.put("/api/sauces/:id", auth, multer, stuffCtrl.modifySauce);
router.delete("/api/sauces/:id", auth, stuffCtrl.deleteSauce);

module.exports = router;