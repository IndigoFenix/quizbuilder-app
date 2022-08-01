'use strict';

const questionRepository = require('../repositories/question');

//Create, update, and delete are included in the quiz service to utilize transactions.

exports.allQuizQuestions = async (qId, includeAnswers) => {
    if (includeAnswers) {
        return await questionRepository.findManyIncludeCorrectAnswers({ 'quiz': qId });
    } else {
        return await questionRepository.findMany({ 'quiz': qId });
    }
};

exports.allQuizAnswers = async (qId) => {
    return await questionRepository.findManyCorrectAnswersOnly({ 'quiz': qId });
};