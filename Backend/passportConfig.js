const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");

function initialize(passport) {
  console.log("Initialized");

  const authenticateUser = (email, password, done) => {
    console.log(email, password);
    pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          console.error("Database error during authentication:", err);
          return done(err);
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          const user = results.rows[0];

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.error("Error comparing passwords:", err);
              return done(err);
            }
            if (isMatch) {
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

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    pool.query(`SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
      if (err) {
        console.error("Error during deserialization:", err);
        return done(err);
      }
      console.log(`ID is ${results.rows[0].id}`);
      return done(null, results.rows[0]);
    });
  });
}

module.exports = initialize;
