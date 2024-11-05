import { WtpController } from './controller/WtpController.js'; 
import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { DbConnectionService } from './service/DbConnectionService.js';

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT;
const dbService = await DbConnectionService.getInstance();

app.use(bodyParser.json());
app.use(cors());

app.get('/', async (req, res) => {
    WtpController.test(req, res);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
