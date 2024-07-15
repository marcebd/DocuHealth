const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

AWS.config.update({
    region: 'us-west-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const rekognition = new AWS.Rekognition();
const collectionId = 'my-face-collection';

app.post('/create-collection', async (req, res) => {
    try {
        const response = await rekognition.createCollection({ CollectionId: collectionId }).promise();
        res.send(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/index-face', async (req, res) => {
    const { imageBytes, imageId } = req.body;
    const params = {
        CollectionId: collectionId,
        Image: { Bytes: Buffer.from(imageBytes, 'base64') },
        ExternalImageId: imageId,
        DetectionAttributes: ['ALL']
    };

    try {
        const response = await rekognition.indexFaces(params).promise();
        res.send(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/search-faces', async (req, res) => {
    const { imageBytes } = req.body;
    const params = {
        CollectionId: collectionId,
        Image: { Bytes: Buffer.from(imageBytes, 'base64') },
        FaceMatchThreshold: 70,
        MaxFaces: 5
    };

    try {
        const response = await rekognition.searchFacesByImage(params).promise();
        res.send(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
