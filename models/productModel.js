const mongoose = require('mongoose');
const { CATEGORIES } = require('../config/data');

const productSchema = new mongoose.Schema({
	name: { type: String, required: true },
	price: { min: 1, type: Number, required: true },
	imagePath: String,
	category: {
		type: String,
		required: true,
		default: CATEGORIES.MISC,
		enum: [CATEGORIES.FOOD, CATEGORIES.TECH, CATEGORIES.CLOTHES, CATEGORIES.MISC]
	},
	stock: { type: Number, min: 0, default: 20 }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
