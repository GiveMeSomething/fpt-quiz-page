import { Model } from 'mongoose'
import { Service } from 'typedi'
import { Undefinable } from '../../@types/app.type'
import { Question, QuestionModel } from '../../models/question'

@Service()
export default class QuizRepository {
    private readonly questionModel: Model<Question>

    constructor() {
        this.questionModel = QuestionModel
    }

    async getFeaturedQuestions(): Promise<Question[]> {
        const questionList = await this.questionModel
            .find({ isFeatured: true }, { _id: 0, question: 1, options: 1, answers: 1 })
            .exec()
        return questionList
    }
}
