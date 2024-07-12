const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");

function initialize(passport) {
  const authenticateUser = (email, password, next, req) => {
    pool.query(
      `SELECT * FROM "User" WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          console.error("Database error during authentication:", err);
          return next(err);
        }

        if (results.rows.length > 0) {
          const user = results.rows[0];
          user.id = user.id;
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.error("Error comparing passwords:", err);
              return next(err);
            }
            if (isMatch) {
              console.log("User authenticated successfully!");
              return next(null, user);
            } else {
              console.log("Password is incorrect");
              return next(null, false, { message: "Password is incorrect" });
            }
          });
        } else {
          console.log("No user with that email address");
          return next(null, false, {
            message: "No user with that email address"
          });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy({
      usernameField: "email",
      passwordField: "password"
    }, authenticateUser)
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    pool.query(`SELECT * FROM "User" WHERE id = $1`, [id], (err, results) => {
      if (err) {
        console.error("Error during deserialization:", err);
        return done(err);
      }
      return done(null, results.rows[0]);
    });
  });
}

module.exports = { initialize };
