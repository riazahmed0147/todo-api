const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
	text: {
		type: String,
		required: true
	},
	title: {
		type: String,
        required: true
	},
	date: {
		type: Date,
		default: Date.now()
	},
    status: {
        type: Boolean,
        default: false,
    }
});

module.exports = Todo = mongoose.model('todo', TodoSchema);