const bcrypt = require("bcrypt");
const db = require("../lib/db");

module.exports = function (app) {
  const passport = require("passport");
  const LocalStrategy = require("passport-local").Strategy;

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    const user = db.get("users").find({ id }).value();

    done(null, { id: user.id, username: user.username });
  });

  passport.use(
    new LocalStrategy(function (username, password, done) {
      const user = db.get("users").find({ username }).value();

      if (!user)
        return done(null, false, { message: "Incorrect user information..." });

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;

        return result
          ? done(null, user)
          : done(null, false, { message: "Incorrect user information..." });
      });
    })
  );

  return passport;
};
