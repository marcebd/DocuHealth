import express from 'express';
import bodyParser from 'body-parser';
import loadRouters from './loaders/routes.js'

const app = express();

app.use(bodyParser.json());
loadRouters(app);

export default app;
