require("dotenv").config();
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const prisma = new PrismaClient();
const app = express();
const cors = require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

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

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
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

  app.delete("/img/:id", async (req, res) => {
    const patientId = req.params.userId;
    if (!patientId) {
      return res.status(400).json({ message: "No patient IDs provided" });
    }
    try {
      const patient = await prisma.patient.findUnique({ where: { id: patientId } });
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      await prisma.picture.delete({
        where: { patientId: parseInt(patientId) },
      });
      res.status(200).json({ message: "Patient Picture Was Deleted Successfully." })
    } catch {
      res.status(500).json({ message: "Error Deleting Patient's Picture, try again." });
    }
  });
