const router = require('express').Router();
const User = require('../models/userModel');
const Product = require('../models/productModel');

// router.get('/', async (req, res) => {
// 	res.send((await User.findById(req.user.id).populate().exec()).cart);
// });

// router.post('/', async (req, res) => {
// 	await User.findByIdAndRemove(req.user.id, { cart: req.body.cart });
// 	res.sendStatus(200);
// });

// Path for buying products
router.post('/purchase', async (req, res) => {
	const cart = req.body.cart;
	const products = await Product.find({
		_id: { $in: cart.map(item => item._id) }
	});
	let totalPrice = 0;
	cart.forEach(item => {
		totalPrice +=
			products.find(product => product.id === item._id).price * item.amount;
	});

	res.send('Price: ' + totalPrice);
});

module.exports = router;
