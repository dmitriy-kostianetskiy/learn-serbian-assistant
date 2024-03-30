import { onRequest } from 'firebase-functions/v2/https';
// import * as logger from 'firebase-functions/logger';
import express from 'express';
import { router } from './routes';
import { openAiToken } from './params/openAiToken';

const app = express();

app.use('/', router);

export const api = onRequest({ secrets: [openAiToken], region: 'europe-west1' }, app);
