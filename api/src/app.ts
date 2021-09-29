import dotenv from 'dotenv';
import passport from 'passport';

import express, { NextFunction, Request, Response } from 'express';

import route from './routes';
import database from './config/database/database';
import useJwtStrategy from './services/auth/jwt.strategy';
import { handleError } from './utils/errorHandler/error';

// Read env variables
dotenv.config();

// Create new express app
const app = express();

// Setup passport configurations
useJwtStrategy(passport);
app.use(passport.initialize());

// Use middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing
route(app);

// Connect to MongoDB or etc
database.connectToDatabase();

// Custom error handler
app.use((err: any, req: Request, res: Response) => {
    handleError(err, req, res);
});

// Start the server at the port specify in env
app.listen(process.env.PORT, () => {
    console.log(`Listening at port: ${process.env.PORT}`);
});
