const express = require("express");
const { pool } = require("./dbConfig");
const multer = require('multer');
const storage = multer.memoryStorage();
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
const minPasswordLength = 6;
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
    secret: "secret",
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

app.get("/users/:userId/patients", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const patients = await prisma.patient.findMany({ where: { userId: userId } });
    patients.forEach(patient => {
      patient.id = patient.id.toString();
      patient.userId = patient.userId.toString();
    });
    return res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/*************** POST ******************/
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
      res.cookie("username", result.rows[0].email, { expires: new Date(Date.now() + 900000000), httpOnly: true });
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

app.post("/login", (req, res) => {
  const user = req.user;
  if (user) {
    res.cookie("username", user.username, { expires: new Date(Date.now() + 900000000), httpOnly: true });
    res.redirect("/");
  } else {
    res.status(401).send("Invalid username or password");
  }
});

function replacer(key, value) {
  if (typeof value === 'bigint') {
      return value.toString(); // Convert BigInt to string
  } else {
      return value; // Return other values unchanged
  }
}
app.post("/profile", upload.single('profilePicture'), async (req, res) => {
  try {
    const existingProfile = await prisma.user_data.findUnique({
      where: { user_id: req.body.userId },
    });

    if (existingProfile) {
      // Update the existing profile
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

app.post("/patients", async (req, res) => {
  const { userId, firstName, middleName, lastName, idNumber, birthDate, prescriptions, conditions } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const patient = await prisma.patient.create({
      data: {
        userId: parseInt(userId),
        firstName,
        middleName,
        lastName,
        idNumber,
        birthDate: new Date(birthDate),
        prescriptions: {
          create: prescriptions.map(prescription => ({
            name: prescription.name,
            dose: prescription.dose,
            instructions: prescription.instructions,
            date: new Date(prescription.date)
          }))
        },
        conditions: {
          create: conditions.map(condition => ({
            name: condition.name,
            date: new Date(condition.date)
          }))
        }
      }
    });
    const responsePatient = {
      ...patient,
      id: patient.id.toString(),
      userId: patient.userId.toString()
    };

    res.status(201).json({ message: "Patient created successfully", patient: responsePatient });
  } catch (error) {
    console.error("Error creating patient", error);
    res.status(500).json({ message: "Failed to create patient", error: error.message });
  }
});

app.post("/notes", async (req, res) => {
  const { patientId, date, notes } = req.body;
  if (!patient) {
    return res.status(400).json({ message: "patientId is required" });
  }
  try {
    const patient = await Patient.findUnique({ where: { id: patientId } });

    const visitNote = await VisitNote.create({ date, notes, patientId });
    patient.visitNotes.push(visitNote);
    await patient.save();
    res.json({ message: "Note added successfully" });
  } catch (error) {
    console.error("Error adding note", error);
    res.status(500).json({ message: "Failed to add note", error: error.message });
  }
});

/********* Delete **********/
app.delete('/users/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId); // Convert the userId to an integer

  try {
    // Check if the user has associated user_data
    const userData = await prisma.user_data.findMany({
      where: { user_id: userId },
    });

    if (userData.length > 0) {
      // If the user has associated user_data, delete their education first
      for (const data of userData) {
        await prisma.education.deleteMany({
          where: { user_data_id: data.id },
        });
      }

      // Then delete the user_data
      await prisma.user_data.deleteMany({
        where: { user_id: userId },
      });
    }

    // Finally, delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    // Handle specific errors if needed (e.g., user not found)
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});
/*********  Helper Functions *********/
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
