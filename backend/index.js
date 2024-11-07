import { WtpController } from './controller/WtpController.js'; 
import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { AuthenticationController } from './controller/AuthenticationController.js';
import { TokenMiddlewareService } from './service/middleware/TokenMiddlewareService.js';

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT;
const wtpController = await WtpController.getInstance();
const authenticationController = await AuthenticationController.getInstance();
const tokenMiddlewareService = TokenMiddlewareService.getInstance()

app.use(bodyParser.json());
app.use(cors());

const apiPrefix = "/api/v1";

app.get(apiPrefix + '/', async (req, res) => {
  wtpController.test(req, res);
});

app.post(apiPrefix + '/register', async (req, res) => {
  await authenticationController.register(req, res);
});

app.post(apiPrefix + '/login', async (req, res) => {
  await authenticationController.login(req, res);
});

app.get(apiPrefix + '/user', tokenMiddlewareService.verifyToken, async (req, res) => {
  await authenticationController.getUser(req, res);
});

app.post(apiPrefix + '/tournament', tokenMiddlewareService.verifyToken, async (req, res) => {
  await wtpController.createTournament(req, res);
});

app.get(apiPrefix + '/tournaments', tokenMiddlewareService.verifyToken, async (req, res) => {
  await wtpController.getTournaments(req, res);
});

app.get(apiPrefix + '/tournament/:id', tokenMiddlewareService.verifyToken, async (req, res) => {
  await wtpController.getTournament(req, res);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
