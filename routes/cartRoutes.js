const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');
const { authUser } = require('../middleware/authMiddleware');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// Route for buying products
router.post('/purchase', authUser, verifyCart, async (req, res) => {
	const idempotencyKey = uuid();
	const token = req.body.token;
	const cart = req.body.cart;

	try {
		// Get specified products from database, so the user can't alter their prices
		const products = await Product.find({
			_id: { $in: cart.map(item => item.productId) }
		});

		// Check if the amount of any product in the cart is greater then its stock
		if (
			cart.find(item => {
				item.amount >
					products.find(product => item.productId === product._id);
			}) != null
		)
			return res.sendStatus(400);

		// Subtract the stock number of the purchased products accordingly
		await Promise.all(
			cart.map(item =>
				Product.findByIdAndUpdate(item.productId, {
					$inc: { stock: -item.amount }
				})
			)
		);

		// Calculate the total price of the order
		const totalPrice = cart.reduce(
			(total, item) =>
				total +
				item.amount *
					products.find(product => product.id === item.productId).price,
			0
		);

		// Checkout with Stripe
		const customer = await stripe.customers.create({
			// Save the suctomer's email
			email: token.email,
			source: token.id
		});

		stripe.charges.create(
			// Charge the customer
			{
				amount: totalPrice,
				currency: 'eur',
				customer: customer.id,
				description: products.length + ' products.'
			},
			{ idempotencyKey }
		);

		// Create an order upon a successful transaction
		await new Order({
			products: cart.map(item => ({
				productId: item._id,
				amount: item.amount
			})),
			totalPrice,
			buyerId: req.user._id
		}).save();

		res.sendStatus(200);
	} catch (err) {
		res.status(400).send(err);
	}
});

router.post('/update', authUser, verifyCart, async (req, res) => {
	const cart = req.body.cart;
	console.log(req.body.cart);

	console.log('we made it past the check');
	await User.findByIdAndUpdate(req.user._id, { cart: req.body.cart });
	res.sendStatus(200);
});

router.get('/', authUser, async (req, res) => {
	const thisUser = await User.findById(req.user._id)
		.select('-password')
		.populate('cart.productId')
		.exec();

	res.send(thisUser.cart);
});

// Check if the cart object is valid
function verifyCart(req, res, next) {
	if (
		req.body.cart.find(
			item =>
				!mongoose.Types.ObjectId.isValid(item.productId) || item.amount < 1
		) != null
	)
		return res.sendStatus(400);

	next();
}

module.exports = router;
