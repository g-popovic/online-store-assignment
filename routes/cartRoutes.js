const router = require('express').Router();
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { authUser } = require('../middleware/authMiddleware');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuid } = require('uuid');

// Route for buying products
router.post('/purchase', authUser, async (req, res) => {
	const idempotencyKey = uuid();
	const token = req.body.token;
	const cart = req.body.cart;

	// Check if the request is valid
	if (cart == null || cart[0] == null || cart[0]._id == null || token == null)
		return res.sendStatus(400);

	// Get specified products from database, so the user can't alter their prices
	const products = await Product.find({
		_id: { $in: cart.map(item => item._id) }
	});

	// Check if the amount of any product in the cart is greater then its stock
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

	// Calculate the total price of the order
	const totalPrice = cart.reduce(
		(total, item) => total + item.amount * item.price,
		0
	);

	// Checkout with Stripe
	stripe.customers
		.create({ email: token.email, source: token.id }) // Create a Stripe customer
		.then(customer => {
			stripe.charges
				.create(
					{
						amount: totalPrice,
						currency: 'eur',
						customer: customer.id,
						description: products.length + ' products.'
					},
					{ idempotencyKey }
				)
				.then(async () => {
					try {
						// Create an order upon a successful transaction
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
				})
				.catch(err => res.send(err));
		})
		.catch(err => res.send(err));
});

module.exports = router;
