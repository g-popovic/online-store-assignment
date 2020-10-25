const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// Endpoint for creating an account
router.post('/register', async (req, res) => {
	const email = req.body.email;
	const password = await bcrypt.hash(req.body.password, 10); // Use bcrypt to hash password

	const newUser = new User({
		email,
		password
	});

	try {
		await newUser.save();
	} catch (err) {
		// If email is already taken return a 403, otherwise return error.
		if (err.code === 11000) return res.status(403).send('Email already taken.');
		return res.send(err);
	}

	res.send(newUser);
});

// Endpoint for loggin in
router.post('/login', async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	// Check if the user exists
	const existingUser = await User.findOne({ email });
	if (existingUser == null) return res.status(401).send('Incorrect email.');

	// Check if the password is correct
	if (await bcrypt.compare(password, existingUser.password)) {
		res.send('Successfully logged in.');
	} else res.send('Incorrect password.');
});

router.get('/status', async (req, res) => {
	res.send('idk');
});

module.exports = router;
