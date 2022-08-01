import { Question } from "./question";

export interface Quiz {
    'id': string
    'user': string
    'title': string
    'questions': Question[]
    'published': boolean
    'copying'?: boolean
    'deleteOk'?: boolean
    'deleting'?: boolean
}