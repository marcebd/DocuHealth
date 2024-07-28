import { pool } from "../dbConfig.js";
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import bcrypt from "bcrypt";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import express from "express";
import flash from "connect-flash";
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import { PrismaClient } from '@prisma/client';
const minPasswordLength = 6;
const noErrors = 0;
import { initialize } from "../passportConfig.js";
initialize(passport);
const prisma = new PrismaClient();
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
        email: req.body.email,
        birthDate: birthDate,
        picture: req.file ? req.file.buffer : null,
        prescriptions: { create: prescriptions },
        conditions: { create: conditions }
      },
    });
    const serializedPatient = JSON.stringify(newPatient.id, replacer);
    res.json(serializedPatient);
  } catch (error) {
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
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post("/patients/names", async (req, res) => {
    const patientIds = req.body.map(id => parseInt(id));
    console.log(patientIds);
    if (!patientIds || patientIds.length === 0) {
      return res.status(400).json({ message: "No patient IDs provided" });
    }
    try {
        const patientsData = await fetchPatientsData(patientIds);
        res.status(200).json(patientsData);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch patient data" });
    }
});

async function fetchPatientsData(patientIds) {
    const patients = await Promise.all(patientIds.map(async (id) => {
        const patient = await prisma.patient.findUnique({
            where: { id }
        });
        if (!patient) {
            console.error("No patient found for ID:", id);
            return null;
        }
        return {
            id: patient.id.toString(),
            firstName: patient.firstName,
            middleName: patient.middleName,
            lastName: patient.lastName
        };
    }));
    return patients.filter(patient => patient !== null);
}


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

  app.post("/appointments/schedule/:patientId", async (req, res) => {
    const patientId = parseInt(req.params.patientId);
    try {
        const newAppointment = await prisma.appointment.create({
            data: {
                appointmentTime: new Date(req.body.appointmentTime),
                timeZone: req.body.timeZone,
                patientId: patientId,
            },
            include: {
                notificationSettings: true,
            }
        });
        if (req.body.notificationSettings && Array.isArray(req.body.notificationSettings)) {
            for (const setting of req.body.notificationSettings) {
                await prisma.notificationSettings.create({
                    data: {
                        number: setting.number,
                        frequency: setting.frequency,
                        appointmentID: newAppointment.id,
                    }
                });
            }
        }
        const patient = await prisma.patient.findUnique({
            where: { id: patientId },
            select: {
                firstName: true,
                lastName: true
            }
        });
        const appointment = await prisma.appointment.findUnique({
            where: {id: newAppointment.id},
            select: {
              id: true,
              appointmentTime: true,
              timeZone: true,
              notificationSettings: true
            }
        });
        const responseData = {
            appointment: {
                appointment,
                patientName: `${patient.firstName} ${patient.lastName}`
            }
        };
        const serializedResponse = JSON.stringify(responseData, replacer);
        res.status(201).json(JSON.parse(serializedResponse));
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error });
    }
});

app.get("/appointments/scheduled", async (req, res) => {
  try {
      const patients = await prisma.patient.findMany({
          where: { appointments: { some: {} } },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            appointments: {
              select: {
                  id: true,
                  appointmentTime: true,
                  timeZone: true,
                  notificationSettings: {
                    select: {
                      number: true,
                      frequency: true,
                    }
                  }
              }
            }
          }
      });
      const serializedPatients = JSON.stringify(patients, replacer);
      res.status(200).json(serializedPatients);
  } catch (error) {
      res.status(500).json({ message: error.message, error: error });
  }
});

app.get("/appointments/scheduled/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
      const patients = await prisma.patient.findMany({
          where: {
            userId: userId,
            appointments: { some: {} } },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            appointments: {
              select: {
                  id: true,
                  appointmentTime: true,
                  timeZone: true,
                  notificationSettings: {
                    select: {
                      number: true,
                      frequency: true,
                    }
                  }
              }
            }
          }
      });
      const serializedPatients = JSON.stringify(patients, replacer);
      res.status(200).json(serializedPatients);
  } catch (error) {
      res.status(500).json({ message: error.message, error: error });
  }
});

app.get("/dashboard/patient/information/:patientId", async (req, res) => {
  const patientId = req.params.patientId;
  try {
      const patients = await prisma.patient.findUnique({
          where: {id: patientId},
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            email: true,
            idNumber: true,
            birthDate: true,
            picture: true,
          }
      });
      const serializedPatients = JSON.stringify(patients, replacer);
      res.status(200).json(serializedPatients);
  } catch (error) {
      res.status(500).json({ message: error.message, error: error });
  }
});

app.post("/patients/:patientId", upload.single('picture'), async (req, res) => {
  try {
      const birthDate = new Date(req.body.birthDate);
      const patientId = req.params.patientId;
      const currentPatient = await prisma.patient.findUnique({
          where: { id: patientId }
      });
      let pictureData = currentPatient.picture;
      if (req.file) {
          pictureData = req.file.buffer;
      }

      const updatedPatient = await prisma.patient.update({
          where: { id: patientId },
          data: {
              firstName: req.body.firstName,
              middleName: req.body.middleName,
              lastName: req.body.lastName,
              idNumber: req.body.idNumber,
              email: req.body.email,
              birthDate: birthDate,
              picture: pictureData
          },
      });
      const serializedPatient = JSON.stringify(updatedPatient.id, replacer);
      res.json(serializedPatient);
  } catch (error) {
      res.status(500).json({ message: "Failed to update patient", error: error.message });
  }
});
