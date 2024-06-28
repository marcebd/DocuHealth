const express = require('express')
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
