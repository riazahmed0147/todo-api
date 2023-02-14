const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Todo = require('../../models/Todos');

// @route   POST api/todos
// @desc    Create a todo
// @access  Public
router.post('/', [
	[
		check('text', 'Text is required').not().isEmpty(),
		check('title', 'Title is required').not().isEmpty(),
	]
], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {

		const newTodo = new Todo({
			text: req.body.text,
			title: req.body.title,
		});

		const todo = await newTodo.save();

		res.json(todo);


	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}

});

// @route   GET api/todos
// @desc    Get all todos
// @access  Private
router.get('/', async (req, res) => {
	try {
		const todos = await Todo.find().sort({ date: -1 });
		res.json(todos);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   GET api/todo/:id
// @desc    Get todo by id
// @access  Private
router.get('/:id', async (req, res) => {
	try {
        console.log(req.params.id)
		const todo = await Todo.findById(req.params.id);

		if (!todo) {
			return res.status(400).json({ msg: 'Todo not found' });
		}

		res.json(todo);
	} catch (err) {
		console.error(err.message);

		if (err.kind === 'ObjectId') {
			return res.status(400).json({ msg: 'Todo not found' });
		}

		res.status(500).send('Server Error');
	}
});

// @route   DELETE api/todo/:id
// @desc    Delete a todo
// @access  Private
router.delete('/:id', async (req, res) => {
	try {
		const todo = await Todo.findById(req.params.id);

		if (!todo) {
			return res.status(400).json({ msg: 'Todo not found' });
		}

		await todo.remove();

		res.json({ msg: 'Todo removed' });
	} catch (err) {
		console.error(err.message);

		if (err.kind === 'ObjectId') {
			return res.status(400).json({ msg: 'Todo not found' });
		}

		res.status(500).send('Server Error');
	}
});

module.exports = router;