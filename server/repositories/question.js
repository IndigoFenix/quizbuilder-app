'use strict';

const Question = require('../models/question');

exports.findMany = async (query) => {
    const result = await Question.find(query).select('id text answers order allAnswers').exec();
    return result;
}

exports.findManyIncludeCorrectAnswers = async (query) => {
    const result = await Question.find(query).select('id text answers order allAnswers correct').exec();
    return result;
}

exports.findManyCorrectAnswersOnly = async (query) => {
    const result = await Question.find(query).select('id correct').exec();
    return result;
}