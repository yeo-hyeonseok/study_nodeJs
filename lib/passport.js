module.exports = function (app) {
  const passport = require("passport");
  const LocalStrategy = require("passport-local").Strategy;

  app.use(passport.initialize());
  app.use(passport.session());

  const authData = {
    username: "id",
    password: "pw",
  };

  passport.serializeUser(function (user, done) {
    done(null, user.username);
  });

  passport.deserializeUser(function (id, done) {
    done(null, authData);
  });

  passport.use(
    new LocalStrategy(function (username, password, done) {
      if (username !== authData.username) {
        return done(null, false, { message: "incorrect username" });
      }

      if (password !== authData.password) {
        return done(null, false, { message: "incorrect password" });
      }

      return done(null, authData);
    })
  );

  return passport;
};
