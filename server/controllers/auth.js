const generateToken = require('../auth/generateToken');
const userService = require('../services/user');

exports.register = async (req, res, next) => {
	try {
		const result = await userService.create(req.body);
		if (result.error) {
			return res.status(result.code).send({ message: result.error });
		}
		res.status(201).json(result.toJSON());
	} catch (error) {
		res.status(500).send({ message: error.message })
	}
};

exports.login = async (req, res, next) => {
	try {
		const result = await userService.findByNameAndPassword(req.body.name, req.body.pass);
		if (result.error) {
			res.status(result.code).send({ message: result.error });
		} else {
			const token = generateToken({ 'id': result.id, 'name': result.name });
			res.status(200).json({
				...result.toJSON(),
				token
			});
		}
	} catch (error) {
		res.status(500).send({ message: error.message })
	}
};