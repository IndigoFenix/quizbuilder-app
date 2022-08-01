'use strict';

const userRepository = require('../repositories/user');
const sha1 = require('salted-sha1');
const { salt } = require('../helpers/consts');
const { randomString } = require('../helpers/helpers');

exports.create = async (data) => {
	const existing = await userRepository.findOne({ 'name': data.name });
	if (existing) {
		return { error: 'A user with this name already exists', code: 409 };
	}
	const user = await userRepository.create({
		'id': randomString(6),
		'name': data.name,
		'pass': sha1(data.pass, salt),
	});
	if (!user) {
		return { error: 'Invalid user data', code: 400 };
	}
	return user;
};

exports.findByNameAndPassword = async (name, pass) => {
	const user = await userRepository.findOne({ 'name': name, 'pass': sha1(pass, salt) });
	if (!user) {
		return { error: 'Incorrect username or password', code: 401 };
	} else {
		return user;
	}
}

exports.get = async (id) => {
	return await userRepository.findOne({ 'id': id });
};

exports.all = async () => {
	return await userRepository.findMany({});
};

exports.delete = async (id) => {
	return await userRepository.deleteOne({ 'id': id });
};