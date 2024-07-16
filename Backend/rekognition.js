require("dotenv").config();
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const cors = require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const bodyParser = require('body-parser');
const { RekognitionClient, CreateCollectionCommand, IndexFacesCommand, SearchFacesByImageCommand } = require('@aws-sdk/client-rekognition');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

const rekognitionClient = new RekognitionClient({
    region: 'us-west-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const collectionId = 'my-face-collection';

app.post('/create-collection', async (req, res) => {
    const command = new CreateCollectionCommand({ CollectionId: collectionId });
    try {
        const response = await rekognitionClient.send(command);
        res.send(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/index-patient-images/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        return res.status(400).send("Invalid userId provided.");
    }
    try {
        const patients = await prisma.patient.findMany({
            where: {
                userId: userId
            },
            select: {
                picture: true,
                id: true
            }
        });

        let indexedCount = 0;
        for (const patient of patients) {
            if (!patient.picture || !(patient.picture instanceof Buffer)) {
                console.error(`No valid picture found for patient ID ${patient.id}`);
                continue;
            }
            const imageBytes = patient.picture; 
            const indexCommand = new IndexFacesCommand({
                CollectionId: collectionId,
                Image: { Bytes: imageBytes },
                ExternalImageId: patient.id.toString(),
            });
            await rekognitionClient.send(indexCommand);
            indexedCount++;
        }

        if (indexedCount === 0) {
            return res.status(500).send("No images were indexed due to errors.");
        }

        res.json({ message: "Images indexed successfully", count: indexedCount });
    } catch (error) {
        console.error("Error processing images:", error);
        res.status(500).send(error.message);
    }
});

app.post('/search-patient-by-image', async (req, res) => {
    const { imageBytes } = req.body;
    const searchCommand = new SearchFacesByImageCommand({
        CollectionId: collectionId,
        Image: { Bytes: Buffer.from(imageBytes, 'base64') },
        FaceMatchThreshold: 70,
        MaxFaces: 1
    });

    try {
        const searchResults = await rekognitionClient.send(searchCommand);
        if (searchResults.FaceMatches.length > 0) {
            const faceMatch = searchResults.FaceMatches[0];
            const patientId = faceMatch.Face.ExternalImageId;
            const patient = await prisma.patient.findUnique({
                where: { id: parseInt(patientId) }
            });

            res.json({ message: "Patient found", patient });
        } else {
            res.status(404).json({ message: "No matching patient found" });
        }
    } catch (error) {
        console.error("Error searching for patient:", error);
        res.status(500).send(error.message);
    }
});

const port = 3003;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
