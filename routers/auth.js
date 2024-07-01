const { Router } = require("express");
const { ensureGuest } = require("../middleware/auth");
const passport = require("passport");

const User = require("../models/User");

const router = new Router();

router.get("/login", ensureGuest, (req, res) => {
  res.render("login");
});

router.get("/signup", ensureGuest, (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    //check if user with this email exists
    let user = await User.findOne({ email });
    if (user) {
      console.log("User already exists");
      return res.redirect("/auth/login");
    } else {
      user = await User.create({
        email,
        password,
        firstName,
        lastName,
      });

      console.log("User created successfully", user);

      return res.status(200).send({});
    }
  } catch (error) {
    console.log("Error logging in");
    res.status(500).send({
      message: "SignUp failed",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user with this email exists

    let user = await User.findOne({ email });
    if (user) {
      if (password !== user.password) {
        return res.status(401).send({
          message: "Login failed",
        });
      }
      res.cookie("user_id", user._id.toString()).status(200).send({
        message: "Login successful",
        redirect_url: "/user/dashboard",
      });
    } else {
      return res.status(401).send({
        redirect_url: "/auth/signup",
      });
    }
  } catch (error) {
    console.log("Error logging in", error);
    res.status(500).send({
      message: "Login failed",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("user_id").redirect("/auth/login");
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
      failureRedirect: "/auth/login"
  }),
    (req, res) => {
        //console.log("Google callback");
        res.redirect("/user/dashboard");
  }
);

module.exports = router;
