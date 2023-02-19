const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	text: {
		type: String,
		required: true,
	},
	todo: {
		type: Schema.Types.ObjectId,
		ref: 'todos',
        required: true,
	},
    date: {
		type: Date,
		default: Date.now(),
	},
    user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
    edited: {
        type: Boolean,
        default: false,
    }
});

module.exports = Comment = mongoose.model('comment', CommentSchema);