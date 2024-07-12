require("dotenv").config();
const cors = require("cors");
const { PrismaClient } = require('@prisma/client');
const passport = require("passport");
const session = require("express-session");
const express = require('express');
const flash = require("connect-flash");
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

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.get('/visitNotes/:patientId', async (req, res) => {
  const patientId = req.params.patientId;
  try {
    const patientExists = await prisma.patient.findUnique({
      where: { id: parseInt(patientId) }
    });
    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const visitNotes = await prisma.visitNote.findMany({where: {patientId: patientId}});
    visitNotes.forEach(note => {
      note.patientId = note.patientId.toString();
      note.id = note.id.toString();
    })
    return res.json(visitNotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post('/visitNotes', async (req, res) => {
  const { patientId, note, visitDate } = req.body;
  if (!patientId || !visitDate || !note) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const patientExists = await prisma.patient.findUnique({
      where: { id: parseInt(patientId) }
    });

    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const visitNote = await prisma.visitNote.create({
      data: { patientId: parseInt(patientId), date: new Date(visitDate), notes: note }
    });
    const visitNoteForResponse = {
      ...visitNote,
      id: visitNote.id.toString(),
      patientId: visitNote.patientId.toString()
    };
    res.status(201).json(visitNoteForResponse);
  } catch (error) {
    console.error('Failed to create visit note:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/prescriptions', async (req, res) => {
  const prescriptions = req.body.prescriptions;
  console.log(prescriptions);

  if (!Array.isArray(prescriptions) || prescriptions.length === 0) {
    return res.status(400).json({ message: "No prescriptions provided or incorrect format" });
  }

  try {
    const createdPrescriptions = [];
    for (const { patientId, name, dose, instructions, date } of prescriptions) {
      if (!patientId || !name || !dose || !date) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const patientExists = await prisma.patient.findUnique({
        where: { id: parseInt(patientId) }
      });

      if (!patientExists) {
        return res.status(404).json({ message: "Patient not found" });
      }

      const prescription = await prisma.prescription.create({
        data: { patientId: parseInt(patientId), name, dose, instructions, date: new Date(date) }
      });

      createdPrescriptions.push({
        ...prescription,
        id: prescription.id.toString(),
        patientId: prescription.patientId.toString()
      });
    }

    res.status(201).json(createdPrescriptions);
  } catch (error) {
    console.error('Failed to create prescriptions:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/prescriptions/:patientId', async (req, res) => {
  const patientId = req.params.patientId;
  try {
    const patientExists = await prisma.patient.findUnique({
      where: { id: parseInt(patientId) }
    });
    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const prescriptions = await prisma.prescription.findMany({where: {patientId: patientId}});
    prescriptions.forEach(prescription => {
      prescription.patientId = prescription.patientId.toString();
      prescription.id = prescription.id.toString();
    })
    return res.json(prescriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3002, () => {
  console.log('Server running on port 3002');
});

app.post("/dashboard/notes/:userId/:id", async (req, res) => {

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
