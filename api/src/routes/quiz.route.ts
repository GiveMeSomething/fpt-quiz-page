import { Router } from 'express';
import { Service } from 'typedi';

@Service()
export default class QuizRouter {
    constructor() {}

    route() {
        const router = Router();

        return router;
    }
}
