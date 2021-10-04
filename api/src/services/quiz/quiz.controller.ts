import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import QuizService from './quiz.service';

@Service()
export default class QuizController {
    private readonly quizService: QuizService;

    constructor(quizService: QuizService) {
        this.quizService = quizService;

        this.getAllQuestion = this.getAllQuestion.bind(this);
        this.checkResult = this.checkResult.bind(this);
    }

    async getAllQuestion(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.cookies['quiz-id']);
            const { questionList, answerToken } = await this.quizService.getFeaturedQuestions();

            // Expire in a day (temporarly)
            res.cookie('quiz-id', answerToken, {
                maxAge: 24 * 60 * 60,
            });

            res.json(questionList);
        } catch (err) {
            next(err);
        }
    }

    checkResult(req: Request, res: Response, next: NextFunction) {
        try {
            const answers = req.cookies['quiz-id'].split('|');
            const userAnswers = req.body.answers.split('|');

            res.json({ result: this.quizService.compareAnswer(answers, userAnswers) });
        } catch (err) {
            next(err);
        }
    }
}
