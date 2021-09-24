import express from 'express';

import route from './routes';
import database from './config/database/database';

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded());

// Routing
route(app);

// Connect to MongoDB or etc
database.connectToDatabase();

app.listen(process.env.PORT, () => {
    console.log(`Listening at port: ${process.env.PORT}`);
});
