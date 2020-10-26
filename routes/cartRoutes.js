const router = require('express').Router();
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { authUser, authRole } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/userRoles');
const moment = require('moment');
const _ = require('lodash');
const { result } = require('lodash');

// Route for buying products
router.post('/purchase', authUser, async (req, res) => {
	const cart = req.body.cart;
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

// Admin only route for getting the day-to-day profits in the last 30 days
router.get('/sales-statistics', authRole(ROLES.ADMIN), async (req, res) => {
	// Create an object which groups all orders made in the same day under the same field
	const ordersGroupedByDays = _.groupBy(await Order.find(), result =>
		moment(result.createdAt.getTime()).startOf('day').unix()
	);

	const now = moment(new Date().getTime()).startOf('day');
	const profitsPerDay = [];
	const howManyDays = 31;

	// Get the profits for the past 31 days
	for (let i = 0; i < howManyDays; i++) {
		// The timestamp of the current iteration of the loop (that day at midnight)
		const currentTimestamp = Math.floor(now / 1000) - i * 24 * 60 * 60;

		// The sales of the current iteration a.k.a. current day
		const currentDaySales = ordersGroupedByDays[currentTimestamp];

		// Calculate the total money earned for that day
		const profitForTheDay = currentDaySales
			? currentDaySales.reduce((total, order) => total + order.totalPrice, 0)
			: 0;

		// Add an array with a timestamp & a corresponding profit amount
		// to the main array
		profitsPerDay.push([currentTimestamp, profitForTheDay]);
	}

	res.send(profitsPerDay);
});

module.exports = router;
