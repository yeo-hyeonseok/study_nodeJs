const express = require("express");
const router = express.Router();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const shortId = require("shortid");

const adapter = new FileSync("db.json");
const db = low(adapter);

module.exports = function (passport) {
  router.get("/register", (req, res) => {
    const message = req.flash("error");

    res.render("register", { message: message[0] });
  });

  router.post("/register_process", (req, res) => {
    const { username, password, password2 } = req.body;

    const users = db.get("users").value();

    if (username === "" || password === "" || password2 === "") {
      req.flash("error", "There is empty field...");
      return res.redirect("/auth/register");
    }

    if (password !== password2) {
      req.flash("error", "Password must be same...");
      return res.redirect("/auth/register");
    }

    if (users.findIndex((item) => item.username === username) >= 0) {
      req.flash("error", "Id already exist...");
      return res.redirect("/auth/register");
    }

    db.get("users")
      .push({
        id: shortId.generate(),
        username,
        password,
      })
      .write();

    res.redirect("/");
  });

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
