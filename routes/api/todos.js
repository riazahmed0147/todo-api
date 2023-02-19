const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Todo = require('../../models/Todo');

// @route   POST api/todos
// @desc    Create a todo
// @access  Private
router.post('/', [
	auth,
	[
		check('title', 'Title is required').not().isEmpty(),
		check('description', 'Description is required').not().isEmpty(),
	]
], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const newTodo = new Todo({
			title: req.body.title,
			description: req.body.description,
			user: req.user.id,
		});

		const todo = await newTodo.save();

		res.json(todo);


	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}

});

// @route   GET api/todos
// @desc    Get all logged in user todos
// @access  Private
router.get('/', auth, async (req, res) => {
	try {
		const todos = await Todo.find({ user: req.user.id }, { title: 1, status: 1, important: 1 }).sort({ date: -1 }).populate('users')
		res.json(todos);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   GET api/todos/:id
// @desc    Get todo by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
	try {
		const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });

		if (!todo) {
			return res.status(400).json({ msg: 'Todo not found' });
		}

		res.json(todo);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   DELETE api/todos/:id
// @desc    Delete a todo
// @access  Private
router.delete('/:id', auth, async (req, res) => {
	try {
		const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });

		if (!todo) {
			return res.status(400).json({ msg: 'Todo not found' });
		}

		await todo.remove();

		res.json({ msg: 'Todo removed' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   PUT api/todos/:id
// @desc    Update a todo
// @access  Private
router.put('/:id', [
	auth,
	[
		check('title', 'Title is required').not().isEmpty(),
		check('description', 'Description is required').not().isEmpty(),
	]
], async (req, res) => {
	try {
		const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });

		if (!todo) {
			return res.status(400).json({ msg: 'Todo not found' });
		}

		const { title, description, status, important } = req.body;

		todo.title = title ? title : todo.title;
		todo.description = description ? description : todo.description;
		todo.status = status ? status : todo.status;
		todo.important = important ? important : todo.important;

		await todo.save();

		res.json({ msg: 'Todo updated' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;