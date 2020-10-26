const router = require('express').Router();
const Product = require('../models/productModel');
const { authRole } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/userRoles');

// Route for adding products to the database
router.post('/new', authRole(ROLES.ADMIN), async (req, res) => {
	const newProduct = new Product({
		name: req.body.name,
		price: req.body.price,
		imagePath: req.body.imagePath,
		stock: req.body.stock
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
	const shouldSortByStock = req.query.shouldSortByStock;

	res.send(
		(
			await Product.find({ name }).sort(
				shouldSortByStock ? { stock: -1 } : undefined
			)
		).reverse()
	);
});

// Route for editing an existing product
router.post('/edit/:id', authRole(ROLES.ADMIN), async (req, res) => {
	const { name, price, imagePath, stock } = req.body;

	// Verify that the new product details are valid
	if (
		name == null ||
		price == null ||
		price <= 0 ||
		imagePath == null ||
		stock == null
	)
		return res.sendStatus(400);

	try {
		const product = await Product.findByIdAndUpdate(req.params.id, {
			name,
			price,
			imagePath,
			stock
		});
		res.send(product);
	} catch (err) {
		res.send(err);
	}
});

// Protection against regex attacks
function escapeRegex(text) {
	if (text == null) text = '';
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports = router;
