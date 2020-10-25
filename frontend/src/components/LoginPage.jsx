import React from 'react';

export default function LoginPage() {
	return (
		<div className="login-page-container">
			<h1>Super Store</h1>
			<br />
			<input className="form-control mb-3" type="text" placeholder="Email" />
			<input className="form-control" type="text" placeholder="Password" />
			<div className="mt-3">
				<button className="btn btn-secondary mr-3">Login</button>
				<button className="btn btn-primary">Register</button>
			</div>
		</div>
	);
}
