const router = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const isEmail = require('isemail');
const { authRole, authUser } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/data');
const User = require('../models/userModel');

// Route for creating an account
router.post('/register', async (req, res) => {
	const { email, password } = req.body;

	// Check if the details are valid
	if (email && !isEmail.validate(email))
		return res.status(401).send('Invalid email.');
	if (password && password.length < 5)
		return res.status(401).send('Password must be at least 5 characters long.');

	try {
		const newUser = await new User({
			email: req.body.email,
			password: await bcrypt.hash(req.body.password, 10)
		}).save();
		req.login(newUser, err => {
			if (err) res.send(err);
			res.sendStatus(200);
		});
	} catch (err) {
		if (err.code === 11000) {
			return res.status(401).send('Email already taken.');
		}
		res.status(400).send(err);
	}
});

// Route for loggin in
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	// Check is email and password are present
	if (email == null || password == null)
		return res.status(401).send('Enter an email and password.');

	// Get user from DB
	const user = await User.findOne({ email: email });

	// Check if user exists
	if (user == null) return res.status(401).send('Incorrect email.');
	// If user exists but doesn't have a password, they used Google
	if (user.password == null)
		return res.status(401).send('This user uses Google login.');

	// Check if password is correct
	if (await bcrypt.compare(password, user.password)) {
		req.login(user, err => {
			if (err) res.send(err);
			res.sendStatus(200);
		});
	} else res.status(401).send('Incorrect password');
});

// Get the current status, i.e. if the user is logged in or not
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
			? 'https://online-store-assignment.herokuapp.com/'
			: 'http://localhost:3000/'
	);
});

// Route for loggin out
router.post('/logout', (req, res) => {
	req.logOut();
	res.sendStatus(200);
});

router.get('/become-admin/:code', authUser, async (req, res) => {
	const code = req.params.code;

	if (code === process.env.ADMIN_ACCESS_CODE) {
		await User.findByIdAndUpdate(req.user.id, { role: ROLES.ADMIN });
		res.redirect('/api/auth/become-admin-success');
	} else {
		res.redirect('/api/auth/become-admin-fail');
	}
});

router.get('/become-admin-success', authRole(ROLES.ADMIN), (req, res) => {
	res.send('Admin access granted. You may close this tab.');
});

router.get('/become-admin-fail', authRole(ROLES.ADMIN), (req, res) => {
	res.send('Invalid code.');
});

module.exports = router;
