const mongoose = require('mongoose');

const debugSchema = mongoose.Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    questionTitle: {
        type: String,
        required: true
    },
    pocTitle: {
        type: String,
        required: true
    },
    debugs: [{
        line: {
            type: Number,
            required: true
        },
        neCode: {
            type: String,
            required: true
        }
    }]
});

const Debug = mongoose.model('Debug', debugSchema);
module.exports = Debug;