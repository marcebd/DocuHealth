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
  const patientId = req.params.patientId.replace(/"/g, '');
  try {
    const patientExists = await prisma.patient.findUnique({
      where: { id: BigInt(patientId) }
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
      where: { id: BigInt(patientId) }
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
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/prescriptions', async (req, res) => {
  const prescriptions = req.body.prescriptions;

  if (!Array.isArray(prescriptions) || prescriptions.length === 0) {
    return res.status(400).json({ message: "No prescriptions provided or incorrect format" });
  }

  try {
    const createdPrescriptions = [];
    for (const { patientId, name, dose, instructions, dateEnd, dateStart } of prescriptions) {
      if (!patientId || !name || !dose || !dateStart) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const patientExists = await prisma.patient.findUnique({
        where: { id: parseInt(patientId) }
      });

      if (!patientExists) {
        return res.status(404).json({ message: "Patient not found" });
      }

      const prescription = await prisma.prescription.create({
        data: { patientId: parseInt(patientId), name, dose, instructions, dateStart: new Date(dateStart), dateEnd: dateEnd ? new Date(dateEnd) : null}
      });

      createdPrescriptions.push({
        ...prescription,
        id: prescription.id.toString(),
        patientId: prescription.patientId.toString()
      });
    }

    res.status(201).json(createdPrescriptions);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
});

app.get('/prescriptions/:patientId', async (req, res) => {
  const patientId = req.params.patientId.replace(/"/g, '');
  try {
    const patientExists = await prisma.patient.findUnique({
      where: { id: BigInt(patientId) }
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

app.listen(3004, () => {
  console.log('Server running on port 3004');
});

app.post('/conditions', async (req, res) => {
  const conditions = req.body.conditions;

  if (!Array.isArray(conditions) || conditions.length === 0) {
    return res.status(400).json({ message: "No conditions provided or incorrect format" });
  }

  try {
    const createdCondition = [];
    for (const { patientId, name, dateStart, dateEnd } of conditions) {
      if (!patientId || !name || !dateStart) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const patientExists = await prisma.patient.findUnique({
        where: { id: BigInt(patientId) }
      });

      if (!patientExists) {
        return res.status(404).json({ message: "Patient not found" });
      }

      const condition = await prisma.condition.create({
        data: { patientId: parseInt(patientId), name, dateStart: new Date(dateStart), dateEnd: dateEnd ? new Date(dateEnd) : null }
      });

      createdCondition.push({
        ...condition,
        id: condition.id.toString(),
        patientId: condition.patientId.toString()
      });
    }
    res.status(201).json(createdCondition);
  } catch (error) {
    console.error('Failed to create condition:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/conditions/:patientId', async (req, res) => {
  const patientId = req.params.patientId.replace(/"/g, '');
  try {
    const patientExists = await prisma.patient.findUnique({
      where: { id: BigInt(patientId) }
    });
    if (!patientExists) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const conditions = await prisma.condition.findMany({where: {patientId: BigInt(patientId)}});
    conditions.forEach(condition => {
      condition.patientId = condition.patientId.toString();
      condition.id = condition.id.toString();
    });
    return res.json(conditions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
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
