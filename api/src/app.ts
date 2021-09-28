import express, { Request, Response } from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';

import route from './routes';
import database from './config/database/database';

import { handleError } from './utils/errorHandler/error';

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(express.json());
app.use(express.urlencoded());

// Routing
route(app);

// Connect to MongoDB or etc
database.connectToDatabase();

app.use((err: any, req: Request, res: Response) => {
    handleError(err, req, res);
});

app.listen(process.env.PORT, () => {
    console.log(`Listening at port: ${process.env.PORT}`);
});
