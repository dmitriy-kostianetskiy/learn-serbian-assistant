import { Router } from 'express';
import { wordController } from './word';

export const router = Router();

router.post('/word/:word', wordController);
