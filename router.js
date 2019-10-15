const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const router = require("express").Router();


mongoose.connect("mongodb://localhost:27017/secretBD",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err) => {

    if (err) {
      console.error("[mongodb] DB error: ", err);
    }
    else {
      console.log("[mongodb] DB connected");

    }
  });


const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  }
});

schema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", schema);


//// Define App Routes
router.get("/", (req, res) => {
  res.render("home");
})

router.route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {

    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        // DB error
        console.error("[mongodb] error: ", err);

        res.render("login", { err: "Couldn't login the user!" });
      }
      else if (user) {
        // Password will get decrypted automatically 

        if (user.password === req.body.password) {
          // User exist
          res.render("secrets.ejs");
        }
        else {
          // Invalid username/password
          res.render("login", { err: "Invalid login!" });
        }
      }
      else {
        // No user exist
        res.render("login", { err: "Invalid login!" });
      }

    });

  });


router.route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {

    new User(req.body).save((err, user) => {
      if (err) {
        // DB error
        console.error("[mongodb] error: ", err);

        res.render("register", { err: "Couldn't register the user!" });
      }
      else {
        // Successful registration
        res.render("secrets.ejs");
      }

    });

  });



module.exports = router;
