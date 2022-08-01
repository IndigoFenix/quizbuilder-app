const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    user: { type: String, required: true, index: true },
    title: { type: String, required: true, minlength: 1 },
    published: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false, index: true }
});

schema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj._id;
    delete obj.__v;
    return obj;
}

module.exports = mongoose.model('Quiz', schema);