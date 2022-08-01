'use strict';

const User = require('../models/user');

exports.create = async (data) => {
    const user = new User(data);
    const error = user.validateSync();
    if (error) {
        return null;
    }
    await user.save();
    return user;
}

exports.findOne = async (query) => {
    const result = await User.findOne(query).exec();
    return result;
}

exports.findMany = async (query) => {
    const result = await User.find(query).exec();
    return result;
}

exports.updateOne = async (query, update) => {
    const result = await User.findOneAndUpdate(query, update).exec();
    return result;
}

exports.deleteOne = async (query) => {
    const result = await User.findOneAndDelete(query).exec();
    return result;
}