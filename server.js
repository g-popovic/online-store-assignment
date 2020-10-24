require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_ATLAS_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});
const connection = mongoose.connection;
connection.on('error', err => console.error(err));
connection.on('open', () => console.log('Connected to MongoDB Atlas'));

// Connect app to all of the different routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
