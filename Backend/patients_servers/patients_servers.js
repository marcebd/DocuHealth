const { pool } = require("/Users/marcebd/Desktop/DocuHealth/Backend/dbConfig.js");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const flash = require("connect-flash");
require("dotenv").config();
const { PrismaClient } = require('@prisma/client');
const { initialize } = require("../passportConfig");
initialize(passport);
const express = require('express');
const prisma = new PrismaClient();
const app = express();

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

function replacer(key, value) {
  if (typeof value === 'bigint') {
      return value.toString();
  } else {
      return value;
  }
}

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});

app.post("/patients", upload.single('imgSrc'), async (req, res) => {
  try {
    const birthDate = new Date(req.body.birthDate);
    const prescriptions = JSON.parse(req.body.prescriptions).map(prescription => ({
      ...prescription,
      dateStart: new Date(prescription.dateStart),
      dateEnd: new Date(prescription.dateEnd)
    }));
    const conditions = JSON.parse(req.body.conditions).map(condition => ({
      ...condition,
      dateStart: new Date(condition.dateStart),
      dateEnd: new Date(condition.dateEnd)
    }));

    const newPatient = await prisma.patient.create({
      data: {
        userId: parseInt(req.body.userId),
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        idNumber: req.body.idNumber,
        birthDate: birthDate,
        picture: req.file ? req.file.buffer : null,
        prescriptions: { create: prescriptions },
        conditions: { create: conditions }
      },
    });
    const serializedPatient = JSON.stringify(newPatient, replacer);
    res.json(serializedPatient);
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ message: "Failed to create patient", error: error.message });
  }
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

  app.post("/patients/names", async (req, res) => {
    const patientIds = req.body;
    if (!patientIds || patientIds.length === 0) {
      return res.status(400).json({ message: "No patient IDs provided" });
    }
    const patientsData = await Promise.all(patientIds.map(async (id) => {
      id = parseInt(id);
      const patient = await prisma.patient.findUnique({ where: { id } });
      return {
        id,
        firstName: patient.firstName,
        middleName: patient.middleName,
        lastName: patient.lastName,
      };
    }));
    return res.json(patientsData);
  });


  app.post("/img/:id", async (req, res) => {
    const patientId = req.params.userId;
    const picture = req.body;
    if (!patientId ) {
      return res.status(400).json({ message: "No patient IDs provided" });
    }
    if (!picture) {
      return res.status(400).json({ message: "No patient picture provided" });
    }
    try {
      const patient = await prisma.patient.findUnique({ where: { id: patientId } });
      if(!patient){
        return res.status(404).json({ message: "Patient not found" });
      }
      await prisma.picture.create({
        data: {patientId: parseInt(patientId), picture}
      });
      res.status(201).json({message: 'Patient Picture Was Saved Successfully.'})
    } catch{
      res.status(500).json({ message: "Error Saving Patient's Picture, try again." });
    }
  });
