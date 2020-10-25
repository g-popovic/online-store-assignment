const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: { type: String, required: true },
	price: { min: 1, type: Number, required: true },
	imagePath: String,
	stock: { type: Number, min: 0, default: 20 }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
