'use strict';

const Quiz = require('../models/quiz');
const Question = require('../models/question');
const { randomString } = require('../helpers/helpers');

exports.create = async (data) => {
    const quiz = new Quiz({
        ...data,
        id: randomString(6),
    });
    const error = quiz.validateSync();
    if (error) {
        return null;
    }
    const questions = [];
    for (let i = 0; i < data.questions.length; i++) {
        const questionData = data.questions[i];
        const question = new Question({
            ...questionData,
            id: randomString(6),
            quiz: quiz.id,
            order: i,
            answers: questionData.answers,
            correct: getCorrectArray(questionData.answers)
        });
        const questionError = question.validateSync();
        if (questionError) {
            return null;
        }
        questions.push(question);
    }

    const session = await Quiz.startSession();
    session.startTransaction();
    try {
        await Promise.all(
            Array.from(questions, q => q.save())
                .concat(quiz.save())
        )
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(error);
    }
    session.endSession();
    return quiz;
}

exports.findOne = async (query) => {
    const result = await Quiz.findOne(query).exec();
    return result;
}

exports.findMany = async (query) => {
    const result = await Quiz.find(query).exec();
    return result;
}

exports.updateOne = async (query, data) => {
    const quiz = await Quiz.findOne(query).exec();
    if (!quiz) {
        return null;
    }
    const quizKeys = Object.keys(data);
    for (let k in quizKeys) {
        if (data[quizKeys[k]] !== undefined) {
            quiz[quizKeys[k]] = data[quizKeys[k]];
        }
    }
    const error = quiz.validateSync();
    if (error) {
        return null;
    }
    if (data.questions) {
        const allQuestions = await Question.find({ 'quiz': quiz.id }).select('id text answers').exec();
        const unchangedQuestions = allQuestions.reduce(function (map, question) {
            map[String(question.id)] = question;
            return map;
        }, {});
        const questionsToSave = [];
        for (let i = 0; i < data.questions.length; i++) {
            const questionData = data.questions[i];
            if (unchangedQuestions[questionData.id]) {
                const questionToUpdate = unchangedQuestions[questionData.id];
                const keys = Object.keys(questionData);
                for (let k in keys) {
                    questionToUpdate[keys[k]] = questionData[keys[k]];
                }
                questionToUpdate.correct = getCorrectArray(questionData.answers);
                const questionError = questionToUpdate.validateSync();
                if (questionError) {
                    return null;
                }
                questionsToSave.push(questionToUpdate);
                delete unchangedQuestions[questionData.id];
            } else {
                delete questionData._id;
                delete questionData.id;
                const correct = getCorrectArray(questionData);
                const newQuestion = new Question({
                    ...questionData,
                    id: randomString(6),
                    quiz: quiz.id,
                    order: i,
                    correct
                });
                questionsToSave.push(newQuestion);
            }
        }
        const questionIdsToDelete = Object.keys(unchangedQuestions);
        const session = await Quiz.startSession();
        session.startTransaction();
        try {
            await Promise.all(
                Array.from(questionsToSave, q => q.save())
                    .concat(quiz.save())
                    .concat(Question.deleteMany({ 'id': { '$in': questionIdsToDelete } }).exec())
            )
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw new Error(error);
        }
        session.endSession();
    } else {
        await quiz.save();
    }
    return quiz;
}

exports.deleteOne = async (query) => {
    const quiz = await Quiz.findOne(query).exec();
    if (quiz) {
        const session = await Quiz.startSession();
        session.startTransaction();
        try {
            await Promise.all([
                Quiz.findOneAndUpdate({ 'id': quiz.id }, { 'deleted': true }).exec(),
                Question.deleteMany({ 'quiz': quiz.id }).exec()
            ]);
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw new Error(error);
        }
        session.endSession();
    }
    return quiz;
}

const getCorrectArray = (answers) => {
    const correct = [];
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].correct) {
            correct.push(i);
        }
    }
    return correct;
}