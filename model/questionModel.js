const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
    point: {type: Number, required: true},
    // content: {type: String, default: 0},
    answer1: {type: Number, default: 0},
    answer2: {type: Number, default: 0},
    answer3: {type: Number, default: 0},
    answer4: {type: Number, default: 0},
    answer5: {type: Number, default: 0},
    answer6: {type: Number, default: 0}
    
});

module.exports = mongoose.model("question", QuestionSchema);