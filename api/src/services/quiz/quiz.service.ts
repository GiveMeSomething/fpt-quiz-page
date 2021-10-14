import 'reflect-metadata'

import { Service } from 'typedi'

import QuizRepository from './quiz.repository'
import { QuizReponse } from './quiz.type'

@Service()
export default class QuizService {
    private readonly quizRepository: QuizRepository

    constructor(quizRepository: QuizRepository) {
        this.quizRepository = quizRepository
    }

    async getFeaturedQuestions(): Promise<QuizReponse> {
        let questionList: any[] = await this.quizRepository.getFeaturedQuestions()
        const answerList: string[][] = []
        questionList = questionList.map((listItem) => {
            const { answers, question, options } = listItem
            answerList.push(answers)
            return { question, options }
        })

        const answerToken = await this.getAnswerToken(answerList)

        return {
            questionList,
            answerToken,
        }
    }

    compareAnswer(original: string[], userInput: string[]) {
        let point = 0
        for (let i = 0; i < original.length; i += 1) {
            if (original[i] === userInput[i]) {
                point += 1
            }
        }

        // Point in 10-scale
        return (point / original.length) * 10
    }

    // Will implement asymetric encryption later
    getAnswerToken(answerList: any[]): Promise<string> {
        const answerToken = answerList.reduce((prev, current) => `${prev}|${current}`)

        return answerToken
    }
}
