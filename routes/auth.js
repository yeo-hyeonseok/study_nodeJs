const express = require("express");
const router = express.Router();

module.exports = function (passport) {
  router.get("/login", (req, res) => {
    const message = req.flash("error");

    res.render("login", { message: message[0] });
  });

  router.post(
    "/login_process",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/auth/login",
      failureFlash: true,
      successFlash: true,
    })
  );

  router.get("/logout_process", (req, res) => {
    req.logOut((err) => {
      if (err) throw err;

      req.session.save();
      res.redirect("/");
    });
  });

  return router;
};
