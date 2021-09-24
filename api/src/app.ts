import express from 'express';

import route from './routes';
import database from './config/database/database';
import { handleError } from './utils/errorHandler/error';

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded());

// Routing
route(app);

// Connect to MongoDB or etc
database.connectToDatabase();

app.use((err: any, req: any, res: any, next: any) => {
    handleError(err, res);
});

app.listen(process.env.PORT, () => {
    console.log(`Listening at port: ${process.env.PORT}`);
});
