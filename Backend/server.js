const express = require("express");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 3000;

const initializePassport = require("./passportConfig");
initializePassport(passport);

// Middleware
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true, 
}));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.get("/users/register", checkAuthenticated, (req, res) => {
  res.json({ message: "Registration page" });
});

app.get("/users/login", checkAuthenticated, (req, res) => {
  res.json({ message: "Login page" });
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
  if (req.user) {
    res.json({ user: req.user.name });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.get("/users/logout", (req, res) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.json({ message: "Logged out successfully" });
  });
});

app.post("/users/register", async (req, res) => {
  let { name, email, password, password2 } = req.body;
  console.log("Received data:", { name, email, password, password2 }); // Log received data
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be at least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
  } else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        `INSERT INTO users (name, email, password)
         VALUES ($1, $2, $3)
         RETURNING id, password`,
        [name, email, hashedPassword]
      );
      res.status(201).json({ message: "User registered successfully", userId: result.rows[0].id });
    } catch (err) {
      console.error("Error during registration:", err);
      res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
  }
});

app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
