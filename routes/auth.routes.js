const express = require('express');
const authRouter = express.Router();
const User = require('../models/User.model');

// BCrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

const routeGuard = require('../configs/route-guard.config');


authRouter.post("/signup", (req, res, next) => {
  const {username, email, password} = req.body
  // const username = req.body.username;
  // const email = req.body.email;
  // const password = req.body.password;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "" || email ==="") {
    res.render("auth/signup", {
      errorMessage: "Please fill up all the forms."
    });
    return;
  }

  User.findOne({
      "username": username
    })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
          username,
          passwordHash: hashPass,
          email
        })
        .then(() => {
          res.redirect("/");
        })
        .catch(error => {
          console.log(error);
        })
    })
    .catch(error => {
      next(error);
    })
});

authRouter.get("/signup", (req, res, next) => {
  res.render("auth-views/signup");
});

authRouter.get("/login", (req, res, next) => {
  res.render("auth-views/login");
});

authRouter.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("auth-views/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("auth-views/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.passwordHash)) {
        // Save the login in the session!
        req.session.currentUser = theUsername;
        res.redirect("/");
      } else {
        res.render("auth-views/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});

authRouter.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/");
  });
});

module.exports = authRouter;