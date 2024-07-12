const { pool } = require("/Users/marcebd/Desktop/DocuHealth/Backend/dbConfig.js");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const flash = require("connect-flash");
require("dotenv").config();
const { PrismaClient } = require('@prisma/client');
const minPasswordLength = 6;
const noErrors = 0;
const { initialize } = require("../passportConfig");
initialize(passport);
const express = require('express');
const prisma = new PrismaClient();


const app = express();

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true,
}));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.get("/register", (req, res, next) => {
  res.json({ message: "Registration page" });
});

app.get("/dashboard", passport.authenticate('local'), (req, res, next) => {
  res.json({ message: "Dashboard page" });
});

app.get("/logout", (req, res) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.json({ message: "Logged out successfully" });
  });
});

app.get("/:userId/dashboard/name/picture", checkNotAuthenticated, async(req, res) => {
    try {
      const userId = req.params.userId;
      const userData = await prisma.user_data.findUnique({ where: { user_id: userId } });
      res.json({
        first_name: userData.first_name,
        profile_picture: userData.profile_picture,
      });
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }

});

app.post("/register", async (req, res) => {
  let { email, password, password2 } = req.body;
  let errors = [];

  if (!email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < minPasswordLength) {
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
        `INSERT INTO "User" (email, password)
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

app.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Email and password are required");
    return;
  }
  passport.authenticate("local", { session: true }, (err, user, info) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (!user) {
      res.status(401).send({ message: "Invalid credentials" });
      return;
    }

    req.login(user, err => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.json({ userId: user.id });
    });
  })(req, res, next);
});

function replacer(key, value) {
  if (typeof value === 'bigint') {
      return value.toString();
  } else {
      return value;
  }
}

app.post("/profile", upload.single('profilePicture'), async (req, res) => {
  try {
    const existingProfile = await prisma.user_data.findUnique({
      where: { user_id: req.body.userId },
    });

    if (existingProfile) {
      const updatedProfile = await prisma.user_data.update({
        where: { user_id: req.body.userId },
        data: {
          first_name: req.body.firstName,
          middle_name: req.body.middleName,
          last_name: req.body.lastName,
          phone_number: req.body.contactNumber,
          specialty: { set: req.body.specialty.split(',') },
          id_number: req.body.idNumber,
          date_of_birth: new Date(req.body.dateBirth),
          gender: req.body.gender,
          languages: { set: JSON.parse(req.body.languages) },
          location: { set: JSON.parse(req.body.locations) },
          education: { create: JSON.parse(req.body.education) },
          biography: req.body.biography,
          profile_picture: req.file ? req.file.buffer : null,
        },
      });
      const serializedProfile = JSON.stringify(updatedProfile, replacer);
      res.json(serializedProfile);
    } else {
      // Create a new profile
      const newProfile = await prisma.user_data.create({
        data: {
          user_id: req.body.userId,
          first_name: req.body.firstName,
          middle_name: req.body.middleName,
          last_name: req.body.lastName,
          phone_number: req.body.contactNumber,
          specialty: { set: req.body.specialty.split(',') },
          id_number: req.body.idNumber,
          date_of_birth: new Date(req.body.dateBirth),
          gender: req.body.gender,
          languages: { set: JSON.parse(req.body.languages) },
          location: { set: JSON.parse(req.body.locations) },
          education: { create: JSON.parse(req.body.education) },
          biography: req.body.biography,
          profile_picture: req.file ? req.file.buffer : null,
        },
      });
      const serializedProfile = JSON.stringify(newProfile, replacer);
      res.json(serializedProfile);
    }
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ message: "Failed to create profile", error: error.message });
  }
});

app.delete('/users/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const userData = await prisma.user_data.findMany({
      where: { user_id: userId },
    });

    if (userData.length > 0) {
      for (const data of userData) {
        await prisma.education.deleteMany({
          where: { user_data_id: data.id },
        });
      }
      await prisma.user_data.deleteMany({
        where: { user_id: userId },
      });
    }
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
});

// Helper Functions
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
