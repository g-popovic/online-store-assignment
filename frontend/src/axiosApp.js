import axios from 'axios';

export default axios.create({
	baseURL:
		process.env.NODE_ENV === 'production'
			? 'https://online-store-assignment.herokuapp.com/api/'
			: 'http://localhost:5000/api/',
	withCredentials: true
});
