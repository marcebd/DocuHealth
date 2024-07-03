const express = require("express");
const { pool } = require("./dbConfig");
const multer = require('multer');
const storage = multer.memoryStorage(); // Storing files in memory
const upload = multer({ storage: storage });
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const flash = require("connect-flash");
require("dotenv").config();
const app = express();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const minPasswordLenght = 6;
const noErrors = 0;
const initializePassport = require("./passportConfig");
initializePassport(passport);

// Middleware
app.use(express.json());
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

app.post("/profile", upload.single('profilePicture'), async (req, res) => {
  try {
    // Parse JSON strings into objects
    const languages = req.body.languages ? JSON.parse(req.body.languages) : [];
    const location = req.body.locations ? JSON.parse(req.body.locations) : [];
    const education = req.body.education ? JSON.parse(req.body.education) : [];

    const newProfile = await prisma.user_data.create({
      data: {
        first_name: req.body.firstName, // Make sure this matches the client's data key
        middle_name: req.body.middleName,
        last_name: req.body.lastName,
        phone_number: req.body.contactNumber,
        specialty: { set: req.body.specialty.split(',') },
        id_number: req.body.idNumber,
        date_of_birth: new Date(req.body.dateBirth),
        gender: req.body.gender,
        languages: { set: languages },
        location: { set: location },
        education: { create: education },
        biography: req.body.biography,
        profile_picture: req.file ? req.file.buffer : null,
        user: req.body.user,
        user_id: req.body.userID
      }
    });
    res.status(201).json(newProfile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ message: "Failed to create profile", error: error.message });
  }
});

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
