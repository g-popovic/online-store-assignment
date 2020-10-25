import React from 'react';
import { Link } from 'react-router-dom';
import axiosApp from '../axiosApp';

export default function Navbar(props) {
	async function logout() {
		await axiosApp.post('/auth/logout');
		window.location.reload();
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<Link className="navbar-brand" href="/">
				TripBnb
			</Link>
			<button
				className="navbar-toggler"
				type="button"
				data-toggle="collapse"
				data-target="#navbarNav"
				aria-controls="navbarNav"
				aria-expanded="false"
				aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>
			<div className="collapse navbar-collapse" id="navbarNav">
				<ul className="navbar-nav">
					<li className="nav-item">
						<Link className="nav-link" to="/">
							Home
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="/cart">
							Cart
						</Link>
					</li>
					{props.isAdmin ? (
						<li className="nav-item">
							<a onClick={props.openPanel} className="nav-link">
								New Product
							</a>
						</li>
					) : null}
					<li className="nav-item">
						<a className="nav-link" onClick={logout}>
							Logout
						</a>
					</li>
				</ul>
			</div>
		</nav>
	);
}
