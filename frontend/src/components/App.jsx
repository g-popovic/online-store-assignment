import React, { useEffect, useState } from 'react';
import LoginPage from './LoginPage';
import Navbar from './Navbar';
import ProductsPage from './ProductsPage';
import CartPage from './CartPage';
import DashboardPage from './DashboardPage';
import EditPanel from './EditPanel';
import axios from 'axios';
import axiosApp from '../axiosApp';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

export default function App() {
	const [userRole, setUserRole] = useState(null);
	const [cart, setCart] = useState([]);
	const [panelOpen, setPanelOpen] = useState(false);
	const [panelInfo, setPanelInfo] = useState({});

	useEffect(() => {
		const source = axios.CancelToken.source();

		async function getStatus() {
			const userRole = await axiosApp.get('/auth/status', {
				cancelToken: source.token
			});
			setUserRole(userRole.data.role);
		}

		getStatus();

		return () => {
			source.cancel();
		};
	}, []);

	function addToCart(product) {
		if (cart.find(item => item._id === product._id) == null) {
			setCart(prev => [...prev, { ...product, amount: 1 }]);
			alert('Added.');
		} else alert('Item already in cart.');
	}

	// Handle user changing the amount of a product in the cart
	function handleCartChange(id, amount) {
		setCart(prev => {
			if (prev.find(item => item._id === id) == null) return;

			const item = prev.find(item => item._id === id);
			item.amount =
				Number(amount) <= 0
					? 1
					: Number(amount) > item.stock
					? item.stock
					: Number(amount);
			return [...prev];
		});
	}

	function removeCartItem(id) {
		setCart(prev => {
			return prev.filter(item => item._id !== id);
		});
	}

	function editProduct(product) {
		if (product == null) return;
		setPanelInfo(product);
		setPanelOpen(true);
	}

	if (userRole == null) return <LoginPage />;
	return (
		<Router>
			<Navbar
				openPanel={() => setPanelOpen(true)}
				isAdmin={userRole === 'admin'}
			/>
			{panelOpen && userRole === 'admin' ? (
				<EditPanel
					close={() => {
						setPanelOpen(false);
						setPanelInfo({});
					}}
					id={panelInfo._id}
					name={panelInfo.name}
					price={panelInfo.price}
					imagePath={panelInfo.imagePath}
					stock={panelInfo.stock}
				/>
			) : null}
			<Switch>
				<Route
					exact
					path="/"
					component={() => (
						<ProductsPage
							addToCart={addToCart}
							editProduct={editProduct}
							userRole={userRole}
						/>
					)}
				/>
				<Route
					exact
					path="/cart"
					component={() => (
						<CartPage
							handleChange={handleCartChange}
							removeCartItem={removeCartItem}
							clearCart={() => setCart([])}
							cart={cart}
						/>
					)}
				/>
				<Route
					exact
					path="/dashboard"
					component={() =>
						userRole === 'admin' ? (
							<DashboardPage />
						) : (
							<Redirect to="/" />
						)
					}
				/>
				<Route component={() => <h1>Error: 404 Not Found</h1>} />
			</Switch>
		</Router>
	);
}
