const express = require("express");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const flash = require("connect-flash");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 3000;
const minPasswordLenght = 6;
const noErrors = 0;
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
app.use(flash());  // Use connect-flash middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

/*************** GET ******************/
app.get("/register", checkAuthenticated, (req, res) => {
  res.json({ message: "Registration page" });
});

app.get("/login", checkAuthenticated, (req, res) => {
  res.json({ message: "Login page" });
});

app.get("/dashboard", checkNotAuthenticated, (req, res) => {
  if (req.user) {
    res.json({ user: req.user.name });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.get("/logout", (req, res) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.json({ message: "Logged out successfully" });
  });
});

/*************** POST ******************/
app.post("/register", async (req, res) => {
  let { email, password, password2 } = req.body;
  let errors = [];

  if (!email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < minPasswordLenght) {
    errors.push({ message: "Password must be at least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > noErrors) {
    res.status(400).json({ errors });
  } else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        `INSERT INTO users (email, password)
         VALUES ($1, $2)
         RETURNING id, password`,
        [email, hashedPassword]
      );
      res.status(201).json({ message: "User registered successfully", userId: result.rows[0].id });
    } catch (err) {
      console.error("Error during registration:", err);
      res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Welcome to the dashboard!"
  })
);

app.post("/profile", async (req, res) => {
  let {first_name, middle_name, last_name, phone_number, specialty, id_number, date_of_birth, gender,
    languages, location, education, biography, profile_picture} = req.body;

    
})


//Helper Functions
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
