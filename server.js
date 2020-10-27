require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const flash = require('connect-flash');
const path = require('path');
require('./config/passportSetup');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

app.use(express.json());
app.use(
	cors({
		credentials: true,
		origin:
			process.env.NODE_ENV === 'production'
				? 'https://online-store-assignment.herokuapp.com/'
				: 'http://localhost:3000'
	})
);
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: new MemoryStore({
			checkPeriod: 15 * 60 * 1000
		}),
		cookie: {
			maxAge: 60 * 24 * 60 * 1000
		}
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_ATLAS_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false
});
const connection = mongoose.connection;
connection.on('error', err => console.error(err));
connection.on('open', () => console.log('Connected to MongoDB Atlas'));

// Connect app to all of the different routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Serve static resources i.e. react build directory
if (process.env.NODE_ENV === 'production') {
	app.use(express.static('frontend/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
	});
}

// Run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
