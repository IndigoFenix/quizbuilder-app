const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, unique: true, index: true, minlength: 1 },
    pass: { type: String, required: true, minlength: 1 },
});

schema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj._id;
    delete obj.__v;
    delete obj.pass;
    return obj;
}

module.exports = mongoose.model('User', schema);