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
	let totalPrice = 0;
	cart.forEach(item => {
		totalPrice +=
			products.find(product => product.id === item._id).price * item.amount;
	});

	try {
		await new Order({
			products: cart.map(item => ({
				productId: item._id,
				amount: item.amount
			})),
			totalPrice,
			buyerId: req.user.email
		}).save();

		res.sendStatus(200);
	} catch (err) {
		res.send(err);
	}
});

module.exports = router;
