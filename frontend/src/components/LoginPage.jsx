import React, { useState } from 'react';
import axiosApp from '../axiosApp';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	async function login() {
		try {
			await axiosApp.post('/auth/login', { email, password });
			window.location.reload();
		} catch (err) {
			if (err.response && err.response.status === 401)
				alert(err.response.data);
			console.log(err);
		}
	}

	async function register() {
		try {
			await axiosApp.post('/auth/register', { email, password });
			window.location.reload();
		} catch (err) {
			if (err.response && err.response.status === 401)
				alert(err.response.data);
			console.log(err);
		}
	}

	return (
		<div className="login-page-container">
			<h1>Super Store</h1>
			<br />
			<form onSubmit={e => e.preventDefault}>
				<input
					className="form-control mb-3"
					type="text"
					placeholder="Email"
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
				<input
					className="form-control"
					type="text"
					placeholder="Password"
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<a
					className="btn btn-primary mt-3"
					href="http://localhost:5000/auth/google">
					Continue With Google
				</a>

				<div className="mt-3">
					<button
						type="submit"
						className="btn btn-secondary mr-3"
						onClick={login}>
						Login
					</button>
					<button
						type="submit"
						className="btn btn-secondary"
						onClick={register}>
						Register
					</button>
				</div>
			</form>
		</div>
	);
}
