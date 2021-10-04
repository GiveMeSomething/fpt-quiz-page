import { Model } from 'mongoose';
import { Service } from 'typedi';
import { Question, QuestionModel } from '../../models/question';

@Service()
export default class QuizRepository {
    private readonly questionModel: Model<Question>;

    constructor() {
        this.questionModel = QuestionModel;
    }

    async create(question: Question): Promise<Question> {
        const newQuestion = new this.questionModel({ ...question });
        return newQuestion.save();
    }

    async getFeaturedQuestions(): Promise<Question[]> {
        const questionList = await this.questionModel.find({ isFeatured: true }).exec();
        return questionList;
    }

    async findQuestionById(questionId: string): Promise<Question> {
        const question = await this.questionModel.findOne({ _id: questionId }).exec();
        return question;
    }
}
