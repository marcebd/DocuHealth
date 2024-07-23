import { pool } from "../dbConfig.js";
import cors from "cors";
import express from "express";
import { PrismaClient } from '@prisma/client';
import passport from "passport";
import session from "express-session";
import flash from "connect-flash";
const prisma = new PrismaClient();
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
const app = express();
// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5175',
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
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3002, () => {
  console.log('Server running on port 3002');
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
    res.status(500).json({ message: "Failed to create condition:", eror: error.error });
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
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post('/visitNotes/update/:visitId', async (req, res) => {
  const { visitId } = req.params;
  const { notes } = req.body;
  try {
    const noteExists = await prisma.visitNote.findUnique({
      where: { id: BigInt(visitId) }
    });

    if (!noteExists) {
      return res.status(404).json({ message: "Visit Note not found" });
    }

    const updatedVisitNote = await prisma.visitNote.update({
      where: { id: BigInt(visitId) },
      data: { notes: notes }
    });

    const responseObj = {
      ...updatedVisitNote,
      id: updatedVisitNote.id.toString(),
      patientId: updatedVisitNote.patientId.toString()
    };
    return res.json(responseObj);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating note' });
  }
});

app.post('/conditions/update/:conditionId', async (req, res) => {
  const { conditionId } = req.params;
  const { condition } = req.body;
  try {
    const conditionExisits = await prisma.condition.findUnique({
      where: { id: BigInt(conditionId) }
    });

    if (!conditionExisits) {
      return res.status(404).json({ message: "Condition not found" });
    }

    const updatedCondition = await prisma.condition.update({
      where: { id: BigInt(conditionId) },
      data: { name: condition.name, dateStart: new Date(condition.dateStart), dateEnd: new Date(condition.dateEnd) }
    });

    const responseObj = {
      ...updatedCondition,
      id: updatedCondition.id.toString(),
      patientId: updatedCondition.patientId.toString()
    };
    return res.json(responseObj);
  } catch (error) {
    return res.status(500).json({ message: error.message, error: error.error});
  }
});

app.post('/prescriptions/update/:prescriptionId', async (req, res) => {
  const { prescriptionId } = req.params;
  const { prescription } = req.body;
  try {
    const prescriptionExists = await prisma.prescription.findUnique({
      where: { id: BigInt(prescriptionId) }
    });

    if (!prescriptionExists) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    const updatedPrescription = await prisma.prescription.update({
      where: { id: BigInt(prescriptionId) },
      data: {
        name: prescription.name,
        dose: prescription.dose,
        instructions: prescription.instructions,
        dateStart: new Date(prescription.dateStart),
        dateEnd: new Date(prescription.dateEnd)
      }
    });

    const responseObj = {
      ...updatedPrescription,
      id: updatedPrescription.id.toString(),
      patientId: updatedPrescription.patientId.toString()
    };
    return res.json(responseObj);
  } catch (error) {
    return res.status(500).json({ message: error.message, error: error.error });
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
