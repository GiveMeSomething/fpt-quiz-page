import dotenv from 'dotenv'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import express, { NextFunction, Request, Response } from 'express'

import Container from 'typedi'
import route from './routes'
import database from './config/database/database'
import { handleError } from './utils/errorHandler/error'
import jwtStrategy from './services/auth/jwt.strategy'
import LogMiddleware from './middleware/log.middleware'

// Read env variables
dotenv.config()

// Create new express app
const app = express()
const logMiddleware: LogMiddleware = Container.get(LogMiddleware)

// Setup passport configurations
passport.use(jwtStrategy())
app.use(passport.initialize())

// Use middleware to parse request body
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// Log info of all action to database
app.use(logMiddleware.startLog)

// Routing
route(app)

// Connect to MongoDB or etc
database.connectToDatabase()

// Log error action
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logMiddleware.endLog(err, req, res, next)
})

// Custom error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    handleError(err, req, res, next)
})

// Start the server at the port specify in env
app.listen(process.env.PORT, () => {
    console.log(`Listening at port: ${process.env.PORT}`)
})
