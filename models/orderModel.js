const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
	{
		productId: { type: mongoose.Types.ObjectId, ref: 'Product' },
		amount: { type: Number, default: 1, min: 1 }
	},
	{ _id: false }
);

const orderSchema = new mongoose.Schema({
	products: [itemSchema],
	totalPrice: Number,
	buyerId: { type: mongoose.Types.ObjectId, ref: 'User' }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
