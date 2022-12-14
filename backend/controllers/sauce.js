const fs = require("fs");
const Sauce = require("../models/sauce");

exports.listSauces = (req, res, next) => {
  Sauce.find({})
    .then((sauces) => res.status(200).json(sauces))
    .catch((err) => res.status(500).json(err));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
	.then((sauce) => {
		let sauceObject;
		if(req.file) {
			// Deleting previous image
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => console.log("Image supprimée !"));
			sauceObject = {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
			};
		}
		else {
			sauceObject = { ...req.body };
		}
		// Checking userId
		if(req.auth.userId !== sauce.userId) {
			res.status(403).json({ message: "Vous ne pouvez pas modifier cette sauce." });
		}
		else {
			// Updating Sauce
			Sauce.updateOne(
				{ _id: req.params.id },
				{ ...sauceObject, _id: req.params.id }
			)
			.then(() => res.status(200).json({ message: "Article modifiée !" }))
			.catch((error) => res.status(400).json({ error: error }));
		}
	})
	.catch((error) => res.status(404).json({ error }));

/*
  if(req.file) {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      console.log(sauce.imageUrl);
      fs.unlink(`images/${filename}`, () => console.log("Image supprimée !"));
    });
  }
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Article modifiée !" }))
    .catch((error) => res.status(400).json({ error: error }));
*/
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  const idSauce = req.params.id;

  Sauce.findOne({ _id: idSauce }).then((sauce) => {
    const idIncluded =
      !sauce.usersLiked.includes(req.body.userId) &&
      !sauce.usersDisliked.includes(req.body.userId);
    if (like === 1 && idIncluded) {
      Sauce.updateOne(
        { _id: idSauce },
        {
          $push: { usersLiked: req.body.userId },
          $inc: { likes: +1 },
        }
      )
        .then(() => res.status(200).json({ message: "like ajoutée !" }))
        .catch((error) => res.status(400).json({ error }));
    } else if (like === -1 && idIncluded) {
      Sauce.updateOne(
        { _id: idSauce },
        {
          $push: { usersDisliked: req.body.userId },
          $inc: { dislikes: +1 },
        }
      )
        .then(() => res.status(200).json({ message: "dislike ajoutée !" }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      if (sauce.usersLiked.includes(req.body.userId)) {
        Sauce.updateOne(
          { _id: idSauce },
          {
            $pull: { usersLiked: req.body.userId },
            $inc: { likes: -1 },
          }
        )
          .then(() => res.status(200).json({ message: "like retirée !" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (sauce.usersDisliked.includes(req.body.userId)) {
        Sauce.updateOne(
          { _id: idSauce },
          {
            $pull: { usersDisliked: req.body.userId },
            $inc: { dislikes: -1 },
          }
        )
          .then(() => res.status(200).json({ message: "dislike retirée !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    }
  });
};
