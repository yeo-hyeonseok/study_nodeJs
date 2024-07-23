const express = require("express");
const router = express.Router();
const shortId = require("shortid");
const bcrypt = require("bcrypt");
const db = require("../lib/db");

module.exports = function (passport) {
  router.get("/register", (req, res) => {
    const message = req.flash("error");

    res.render("register", { message: message[0] });
  });

  router.post("/register_process", (req, res) => {
    const { username, password, password2 } = req.body;

    // 빈 필드 검사
    if (username === "" || password === "" || password2 === "") {
      req.flash("error", "There is empty field...");
      return res.redirect("/auth/register");
    }

    // 비밀번호 확인 검사
    if (password !== password2) {
      req.flash("error", "Password must be same...");
      return res.redirect("/auth/register");
    }

    // 아이디 중복 검사
    const users = db.get("users").value();

    if (users.findIndex((item) => item.username === username) >= 0) {
      req.flash("error", "Id already exist...");
      return res.redirect("/auth/register");
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) throw err;

      const user = {
        id: shortId.generate(),
        username,
        password: hash,
      };

      db.get("users").push(user).write();

      req.logIn(user, (err) => {
        if (err) throw err;

        res.redirect("/");
      });
    });
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
