import express from 'express';
import bodyParser from 'body-parser';
import loadRouters from './routes.js'

const app = express();

app.use(bodyParser.jsong());
loadRouters(app);

export default app;
