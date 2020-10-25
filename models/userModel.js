const mongoose = require('mongoose');
const { ROLES } = require('../config/userRoles');

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	role: { type: String, required: true, default: ROLES.BASIC },
	password: String,
	googleId: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
