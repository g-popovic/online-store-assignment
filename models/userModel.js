const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
	{
		productId: mongoose.SchemaTypes.ObjectId,
		amount: { type: Number, default: 1, min: 1 }
	},
	{ _id: false }
);

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	cart: [cartItemSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
