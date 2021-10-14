import { Router } from 'express'
import { Service } from 'typedi'
import QuizController from '../services/quiz/quiz.controller'

@Service()
export default class QuizRouter {
    private readonly quizController: QuizController

    constructor(quizController: QuizController) {
        this.quizController = quizController
    }

    route() {
        const router = Router()

        router.get('/all', this.quizController.getAllQuestion)
        router.post('/get-result', this.quizController.checkResult)

        return router
    }
}
