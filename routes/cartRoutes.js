const router = require('express').Router();
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { authUser } = require('../middleware/authMiddleware');

// Path for buying products
router.post('/purchase', authUser, async (req, res) => {
	const cart = req.body.cart;
	const products = await Product.find({
		_id: { $in: cart.map(item => item._id) }
	});

	// Check if the amount of any product is greater then its stock
	if (
		cart.find(item => {
			item.amount > products.find(product => item._id === product._id);
		}) != null
	)
		return res.sendStatus(400);

	// Subtract the stock number of the purchased products accordingly
	const idk = await Promise.all(
		cart.map(item =>
			Product.findByIdAndUpdate(item._id, { $inc: { stock: -item.amount } })
		)
	);

	const totalPrice = cart.reduce(
		(total, item) => total + item.amount * item.price,
		0
	);

	try {
		// Create an order
		await new Order({
			products: cart.map(item => ({
				productId: item._id,
				amount: item.amount
			})),
			totalPrice,
			buyerId: req.user._id
		}).save();

		res.json(idk);
	} catch (err) {
		res.send(err);
	}
});

module.exports = router;
