import axios from 'axios';

export default axios.create({
	baseURL:
		process.env.NODE_ENV === 'production'
			? 'https://example.com'
			: 'http://localhost:5000',
	withCredentials: true
});
