const express = require('express');
const bodyParser = require('body-parser');
const { RekognitionClient, CreateCollectionCommand, IndexFacesCommand, SearchFacesByImageCommand } = require('@aws-sdk/client-rekognition');

const app = express();
app.use(bodyParser.json());

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

app.post('/search-faces', async (req, res) => {
    const { imageBytes } = req.body;
    const command = new SearchFacesByImageCommand({
        CollectionId: collectionId,
        Image: { Bytes: Buffer.from(imageBytes, 'base64') },
        FaceMatchThreshold: 70,
        MaxFaces: 5
    });

    try {
        const response = await rekognitionClient.send(command);
        res.send(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const port = 3003;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
