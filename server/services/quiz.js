'use strict';

const quizRepository = require('../repositories/quiz');

exports.create = async (data) => {
    const quiz = await quizRepository.create(data);
    if (!quiz) {
        return { error: 'Invalid quiz data', code: 400 };
    }
    return quiz;
};

exports.get = async (id) => {
    const quiz = await quizRepository.findOne({ 'id': id });
    if (!quiz) {
        return { error: 'Quiz not found', code: 404 };
    } else if (quiz.deleted) {
        return { error: 'Quiz has been deleted', code: 404 };
    }
    return quiz;
};

exports.getWithUser = async (id, ownerid) => {
    const quiz = await quizRepository.findOne({ 'id': id });
    if (!quiz) {
        return { error: 'No quiz with this id and owner exists', code: 404 };
    }
    if (quiz.deleted) {
        return { error: 'Quiz was deleted', code: 410 }
    }
    if (String(quiz.user) !== String(ownerid)) {
        return { error: 'Quiz was deleted', code: 403 }
    }
    return quiz;
};

exports.update = async (id, ownerid, data) => {
    const quiz = await quizRepository.updateOne({ 'id': id, 'user': ownerid, 'published': false, 'deleted': false }, {
        title: data.title,
        published: data.published,
        questions: data.questions,
    });
    if (!quiz) {
        const errorCheck = await this.getWithUser(id, ownerid);
        if (errorCheck.error) return errorCheck;
        if (errorCheck.published) return { error: 'Quiz was alreaady published', code: 409 }
        return { error: 'Invalid quiz data', code: 403 };
    }
    return { success: true };
};

exports.allOfUser = async (userId) => {
    return await quizRepository.findMany({ 'user': userId, 'deleted': false });
};

exports.delete = async (id, ownerid) => {
    const result = await quizRepository.deleteOne({ 'id': id, 'user': ownerid, 'deleted': false });
    if (!result) {
        return this.getWithUser(id, ownerid);
    }
    return { success: true };
};