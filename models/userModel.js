const mongoose = require('mongoose');
const { ROLES } = require('../config/userRoles');

const cartItemSchema = new mongoose.Schema(
	{
		productId: mongoose.SchemaTypes.ObjectId,
		amount: { type: Number, default: 1, min: 1 }
	},
	{ _id: false }
);

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	role: { type: String, required: true, default: ROLES.BASIC },
	password: String,
	googleId: String,
	cart: [cartItemSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
