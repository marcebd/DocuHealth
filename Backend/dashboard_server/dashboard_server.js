const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const flash = require("connect-flash");
require("dotenv").config();
const { PrismaClient } = require('@prisma/client');
const PORT = process.env.PORT || 3000;
const initializePassport = require("/Users/marcebd/Desktop/DocuHealth/Backend/passportConfig.js");
initializePassport(passport);

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
app.use(flash());  // Use connect-flash middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.get("/dashboard", checkNotAuthenticated, (req, res) => {
  if (req.user) {
    res.json({ user: req.user.name });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.get('/visitNotes', async (req, res) => {
  const visitNotes = await prisma.visitNote.query();
  res.json(visitNotes);
});

app.post('/visitNotes', async (req, res) => {
  const { patientId, date, notes } = req.body;
  const visitNote = await prisma.visitNote.create({ data: { patientId, date, notes } });
  res.json(visitNote);
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
