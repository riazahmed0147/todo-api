const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Comment = require('../../models/Comment');

// @route   POST api/comment
// @desc    Create a comment for a specific todo
// @access  Private
router.post('/', [
	auth,
	[
		check('text', 'Text is required').not().isEmpty()
	]
], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {

		const newComment = new Comment({
			text: req.body.text,
            todo: req.body.todo,
            user: req.user.id
		});

		const comment = await newComment.save();

		res.json(comment);


	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}

});

// @route   GET api/comments/:todo
// @desc    Get all comments linked to a specific todo
// @access  Private
router.get('/:todo', auth, async (req, res) => {
	try {
		const comments = await Comment.find({ user: req.user.id, todo: req.params.todo }).sort({ date: -1 })
		res.json(comments);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   DELETE api/comments/:todo/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:todo/:id', auth, async (req, res) => {
	try {
		const comment = await Comment.findOne({ todo: req.params.todo, _id: req.params.id, user: req.user.id });

		if (!comment) {
			return res.status(400).json({ msg: 'Comment not found' });
		}

		await comment.remove();

		res.json({ msg: 'Comment removed' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   PUT api/comments/:todo/:id
// @desc    Update a todo
// @access  Private
router.put('/:todo/:id', [
	auth,
	[
		check('text', 'Text is required').not().isEmpty()
	]
], async (req, res) => {
	try {
		const comment = await Comment.findOne({ todo: req.params.todo, _id: req.params.id, user: req.user.id });

		if (!comment) {
			return res.status(400).json({ msg: 'Comment not found' });
		}

		const { text } = req.body;

		comment.text = text ? text : todo.text;
        comment.edited = true;

		await comment.save();

		res.json({ msg: 'Comment updated' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;