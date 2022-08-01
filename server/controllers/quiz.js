const quizService = require('../services/quiz');
const questionService = require('../services/question');

exports.get = async (req, res, next) => {
    try {
        const quiz = await quizService.get(req.params.id);
        if (quiz.error) {
            return res.status(quiz.code).send({ message: quiz.error });
        }
        const questions = await questionService.allQuizQuestions(quiz.id, false);
        const result = quiz.toJSON();
        result.questions = questions;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
};

exports.getAnswers = async (req, res, next) => {
    try {
        const questions = await questionService.allQuizAnswers(req.params.id);
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
};