const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
	description: {
		type: String,
		required: true,
	},
	title: {
		type: String,
        required: true
	},
	status: {
        type: Boolean,
        default: false,
    },
	important: {
		type: Boolean,
		default: false,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
});

module.exports = Todo = mongoose.model('todo', TodoSchema);