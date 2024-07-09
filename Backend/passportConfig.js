const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");

function initialize(passport) {

  const authenticateUser = (email, password, done) => {
    pool.query(
      `SELECT * FROM "User" WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          console.error("Database error during authentication:", err);
          return done(err);
        }

        if (results.rows.length > 0) {
          const user = results.rows[0];
          // Make sure the user object has an id property
          user.id = user.id;
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.error("Error comparing passwords:", err);
              return done(err);
            }
            if (isMatch) {
              // Return the valid user object
              return done(null, user);
            } else {
              return done(null, false, { message: "Password is incorrect" });
            }
          });
        } else {
          return done(null, false, {
            message: "No user with that email address"
          });
        }
      }
    );
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );

  passport.serializeUser((user, done) => {
    // Store the user's ID in the cookie
    console.log("serialize", user);
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

module.exports = initialize;
