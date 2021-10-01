import dotenv from 'dotenv';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import express, { NextFunction, Request, Response } from 'express';

import route from './routes';
import database from './config/database/database';
import { handleError } from './utils/errorHandler/error';
import jwtStrategy from './services/auth/jwt.strategy';

// Read env variables
dotenv.config();

// Create new express app
const app = express();

// Setup passport configurations
passport.use(jwtStrategy());
app.use(passport.initialize());

// Use middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routing
route(app);

// Connect to MongoDB or etc
database.connectToDatabase();

// Custom error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    handleError(err, req, res, next);
});

// Start the server at the port specify in env
app.listen(process.env.PORT, () => {
    console.log(`Listening at port: ${process.env.PORT}`);
});
