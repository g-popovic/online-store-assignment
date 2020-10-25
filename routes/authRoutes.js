const router = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/userModel');

// Route for creating an account
router.post('/register', async (req, res) => {
	try {
		const newUser = await new User({
			email: req.body.email,
			password: await bcrypt.hash(req.body.password, 10)
		}).save();

		req.login(newUser, err => {
			if (err) res.send(err);
			res.send('Successfully registered.');
		});
	} catch (err) {
		if (err.code === 11000) {
			return res.status(403).send('Email already taken.');
		}
		res.status(400).send(err);
	}
});

// Route for loggin in
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/auth/login/success',
		failureRedirect: '/auth/login/failed',
		failureFlash: true
	})
);

// Failed login route
router.get('/login/failed', (req, res) => {
	res.status(401).send(req.flash('message')[0]);
});

// Successful login route
router.get('/login/success', (req, res) => {
	res.send('Login successful.');
});

router.get('/status', async (req, res) => {
	res.json(req.user);
});

// Route for google authentication
router.get(
	'/google',
	passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Redirect route after successful google authentication
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
	res.redirect(
		process.env.NODE_ENV === 'production'
			? 'https://dope-kicks.xyz'
			: 'http://localhost:3000'
	);
});

module.exports = router;
