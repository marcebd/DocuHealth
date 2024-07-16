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

function replacer(key, value) {
    if (typeof value === 'bigint') {
        return value.toString();
    } else {
        return value;
    }
}

app.post('/index-patient-images/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        console.log("Invalid userId provided.");
        return res.status(400).json({ message: "Invalid userId provided." });
    }

    try {
        const patients = await prisma.patient.findMany({
            where: {
                userId: userId,
                picture: {
                    not: null
                }
            },
            select: {
                id: true,
                picture: true
            }
        });

        if (patients.length === 0) {
            return res.status(404).json({ message: "No patients found for the given userId." });
        }

        let indexedCount = 0;
        let errors = [];
        for (const patient of patients) {
            const imageBytes = Buffer.from(patient.picture, 'base64');
            const indexCommand = new IndexFacesCommand({
                CollectionId: collectionId,
                Image: { Bytes: imageBytes },
                ExternalImageId: patient.id.toString(),
            });

            try {
                await rekognitionClient.send(indexCommand);
                indexedCount++;
            } catch (awsError) {
                errors.push({ patientId: patient.id.toString(), error: awsError.message });
            }
        }

        if (indexedCount === 0) {
            return res.status(500).json({ message: "No images were indexed due to errors.", errors });
        }
        res.status(200).json({ message: "Images indexed successfully", indexedCount, errors });
    } catch (error) {
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
});

app.post('/search-patient-by-image', async (req, res) => {
    console.log("Received search request with image data");
    if (!req.body.imageBytes) {
        console.error("No image data provided in request");
        return res.status(400).send("Image data is required.");
    }

    const { imageBytes } = req.body;
    const buffer = Buffer.from(imageBytes, 'base64');

    const searchCommand = new SearchFacesByImageCommand({
        CollectionId: collectionId,
        Image: { Bytes: buffer },
        FaceMatchThreshold: 70,
        MaxFaces: 1
    });

    try {
        const searchResults = await rekognitionClient.send(searchCommand);
        console.log("Search results received", searchResults);

        if (searchResults.FaceMatches.length > 0) {
            const faceMatch = searchResults.FaceMatches[0];
            const patientId = faceMatch.Face.ExternalImageId;
            console.log(`Match found, patient ID: ${patientId}`);

            const patient = await prisma.patient.findUnique({
                where: { id: parseInt(patientId) }
            });

            res.json({ message: "Patient found", patient });
        } else {
            console.log("No matching patient found");
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
