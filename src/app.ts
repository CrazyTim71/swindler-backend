import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { config } from 'dotenv';

import * as middlewares from './middlewares';
import api_v1 from './api/v1';
import type MessageResponse from './interfaces/MessageResponse';

config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/health', (req, res) => {
    res.status(200).json({
        message: 'ok',
    });
});

app.use('/api/v1', api_v1);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
