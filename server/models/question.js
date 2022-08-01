const mongoose = require('mongoose');
const { Schema } = mongoose;

const answerSchema = new Schema({
    text: { type: String, required: true }
}, { _id: false });

const schema = new Schema({
    id: { type: String, required: true, unique: true, index: true },
    quiz: { type: String, required: true },
    order: { type: Number, required: true },
    text: { type: String, required: true, minlength: 1 },
    allAnswers: { type: Boolean, default: false },
    answers: [answerSchema],
    correct: [{ type: Number }]
});

schema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj._id;
    delete obj.__v;
    return obj;
}

module.exports = mongoose.model('Question', schema);