import { Answer } from "./answer";

export interface Question {
    'id'?: string
    'text': string
    'allAnswers': boolean
    'order': number
    'answers': Answer[]
    'correct'?: number[]
    'selected'?: number
}