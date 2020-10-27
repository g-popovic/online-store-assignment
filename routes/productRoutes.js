const router = require('express').Router();
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const { authRole } = require('../middleware/authMiddleware');
const { ROLES, CATEGORIES } = require('../config/data');
const moment = require('moment');
const _ = require('lodash');

// Route for adding products to the database
router.post('/new', authRole(ROLES.ADMIN), async (req, res) => {
	const { name, price, imagePath, stock, category } = req.body;

	// Verify that the new product details are valid
	if (
		name == null ||
		price == null ||
		price <= 0 ||
		imagePath == null ||
		stock == null ||
		!isCategoryValid(category)
	)
		return res.sendStatus(400);

	const newProduct = new Product({
		name,
		price,
		imagePath,
		stock,
		category
	});

	try {
		res.send(await newProduct.save());
	} catch (err) {
		res.send(err);
	}
});

// Route for deleting a product
router.delete('/:id', authRole(ROLES.ADMIN), async (req, res) => {
	try {
		await Product.findByIdAndDelete(req.params.id);
		res.sendStatus(200);
	} catch (err) {
		res.send(err);
	}
});

// Route for getting all the products
router.get('/', async (req, res) => {
	const name = new RegExp(escapeRegex(req.query.name), 'gi');
	const sortBy = req.query.sortBy;
	const category = req.query.category;

	res.send(
		(
			await Product.find({
				name,
				category: isCategoryValid(category) ? category : RegExp('')
			}).sort(
				sortBy === 'stock'
					? { stock: -1 }
					: sortBy === 'priceAsc'
					? { price: -1 }
					: sortBy === 'priceDes'
					? { price: 1 }
					: undefined
			)
		).reverse()
	);
});

// Route for editing an existing product
router.post('/edit/:id', authRole(ROLES.ADMIN), async (req, res) => {
	const { name, price, imagePath, stock, category } = req.body;

	// Verify that the new product details are valid
	if (
		name == null ||
		price == null ||
		price <= 0 ||
		imagePath == null ||
		stock == null ||
		!isCategoryValid(category)
	)
		return res.sendStatus(400);

	try {
		const product = await Product.findByIdAndUpdate(req.params.id, {
			name,
			price,
			imagePath,
			stock,
			category
		});
		res.send(product);
	} catch (err) {
		res.send(err);
	}
});

// Admin only route for getting the day-to-day profits in the last 30 days
// Returns a 2D array, each sub-array contains the date as the first item and
// the profits for that date as the second item
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

// Protection against regex attacks
function escapeRegex(text) {
	if (text == null) text = '';
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// Determine if the given category is valid
function isCategoryValid(category) {
	return (
		category === CATEGORIES.MISC ||
		category === CATEGORIES.FOOD ||
		category === CATEGORIES.TECH ||
		category === CATEGORIES.CLOTHES
	);
}

module.exports = router;
