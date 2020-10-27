const mongoose = require('mongoose');
const { ROLES } = require('../config/data');

const itemSchema = new mongoose.Schema(
	{
		productId: { type: mongoose.Types.ObjectId, ref: 'Product' },
		amount: { type: Number, default: 1, min: 1 }
	},
	{ _id: false }
);

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	role: {
		type: String,
		required: true,
		default: ROLES.BASIC,
		enum: [ROLES.BASIC, ROLES.ADMIN]
	},
	password: String,
	googleId: String,
	cart: [itemSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
