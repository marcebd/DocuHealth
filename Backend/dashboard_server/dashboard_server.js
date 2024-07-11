require("dotenv").config();
const { PrismaClient } = require('@prisma/client');

const express = require('express');
const prisma = new PrismaClient();

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
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
