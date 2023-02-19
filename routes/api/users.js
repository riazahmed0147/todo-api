const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../../config/keys');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post('/', [
	check('user_name', 'User name is required').not().isEmpty(),
	check('email', 'Please include a valid email').isEmail(),
	check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
	check('first_name', 'Please enter First Name with 2 or more characters').isLength({ min: 2 }),
	check('last_name', 'Please enter Last Name with 2 or more characters').isLength({ min: 2 })
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { user_name, email, password, first_name, last_name } = req.body;

	try {
		let user = await User.findOne({ user_name });

		if (user) {
			return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
		};

		user = new User({
			user_name,
			email,
			password,
			first_name,
			last_name,
		});

		const salt = await bcrypt.genSalt(10);

		user.password = await bcrypt.hash(password, salt);

		await user.save();

		const payload = {
			user: {
				id: user.id
			}
		}

		jwt.sign(payload, jwtSecretKey, {
			expiresIn: 360000
		}, (err, token) => {
			if (err) throw err;
			res.json({ token })
		});

	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}

});


module.exports = router;