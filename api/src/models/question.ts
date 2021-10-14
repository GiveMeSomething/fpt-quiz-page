import { Document, Model, model, Schema } from 'mongoose'
import { InternalServerException } from '../utils/errorHandler/commonError'

export interface Question extends Document {
    question: string
    options: string[]
    answers: string[]
    isFeatured: boolean
}

export const QuestionSchema: Schema<Question> = new Schema<Question>({
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
    answers: {
        type: [String],
        required: true,
    },
    isFeatured: {
        type: Boolean,
        required: true,
    },
})

// Use similar method as 'merge' in merge sort
function isValidQuestion(options: string[], answers: string[]) {
    // Check if all answers appear in options
    // The data sent from frontend should in ordered format
    let i = 0
    let j = 0
    while (i < options.length && j < answers.length) {
        if (options[i] === answers[j]) {
            i += 1
            j += 1
        } else {
            i += 1
        }
    }
    return j >= answers.length
}

QuestionSchema.pre('save', async function preSave(next: any) {
    // Format options and answer
    this.options = this.options.map((option: string) => option.trim().toLowerCase())
    this.answers = this.answers.map((answer: string) => answer.trim().toLowerCase())

    // If options or answers were modified, process to check
    if (this.isModified('options') || this.isModified('answers')) {
        // Check similarity between questions and answers
        if (isValidQuestion(this.options, this.answers)) {
            next(InternalServerException('Options or answers not match'))
        }
    }

    // New question won't be displayed immediately
    this.isFeatured = false

    next()
})

export const QuestionModel: Model<Question> = model<Question>('Question', QuestionSchema)
