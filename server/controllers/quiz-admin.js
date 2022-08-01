const quizService = require('../services/quiz');
const questionService = require('../services/question');

const maxQuestions = 10;
const maxAnswers = 5;

exports.create = async (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).send({ message: 'No data sent in body' });
        }
        const initialErrors = catchQuizErrors(req.body);
        if (initialErrors) {
            return res.status(initialErrors.code).send({ message: initialErrors.error });
        }
        const quiz = await quizService.create({
            ...req.body,
            user: req.currentUser.id
        });
        if (quiz.error) {
            return res.status(quiz.code).send({ message: quiz.error });
        }

        const result = quiz.toJSON();

        res.status(201).json(result);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
};

exports.all = async (req, res, next) => {
    try {
        const result = await quizService.allOfUser(req.currentUser.id);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
};

exports.get = async (req, res, next) => {
    try {
        const quiz = await quizService.getWithUser(req.params.id, req.currentUser.id);
        if (quiz.error) {
            return res.status(quiz.code).send({ message: quiz.error });
        }
        const questions = await questionService.allQuizQuestions(quiz.id, true);
        const result = quiz.toJSON();
        result.questions = questions;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
};

exports.update = async (req, res, next) => {
    try {
        if (!req.body) {
            return res.status(400).send({ message: 'No data sent in body' });
        }
        if (req.body.questions) {
            const initialErrors = catchQuizErrors(req.body);
            if (initialErrors) {
                return res.status(initialErrors.code).send({ message: initialErrors.error });
            }
        }
        const quizResult = await quizService.update(req.params.id, req.currentUser.id, req.body);
        if (quizResult.error) {
            return res.status(quizResult.code).send({ message: quizResult.error });
        }
        res.status(200).json(quizResult);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
};

exports.delete = async (req, res, next) => {
    try {
        const quizResult = await quizService.delete(req.params.id, req.currentUser.id);
        if (quizResult.error) {
            return res.status(quizResult.code).send({ message: quizResult.error });
        }
        res.status(200).json({ quizResult });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
};

const catchQuizErrors = (data) => {
    if (!data.questions || data.questions.length === 0) {
        return { error: 'Quiz has no questions', code: 400 };
    } else if (data.questions.length > maxQuestions) {
        return { error: `Quiz has more than ${maxQuestions} questions`, code: 400 }
    }
    for (let i = 0; i < data.questions.length; i++) {
        if (data.questions[i].answers.length === 0) {
            return { error: `Question ${i} has no answers`, code: 400 };
        } else if (data.questions[i].answers.length > maxAnswers) {
            return { error: `Question ${i} has more than ${maxAnswers} answers`, code: 400 };
        } else {
            if (!data.questions[i].answers.find(answer => answer.correct === true)) {
                return { error: `Question ${i} has no correct answers`, code: 400 };
            }
        }
    }
    return null;
}
