import 'reflect-metadata'
import { Container } from 'typedi'
import AuthRouter from './auth.route'
import QuizRouter from './quiz.route'

const authRouter = Container.get(AuthRouter)
const quizRouter = Container.get(QuizRouter)

const route = (app: any) => {
    app.use('/auth', authRouter.route())
    app.use('/quiz', quizRouter.route())
}

export default route
