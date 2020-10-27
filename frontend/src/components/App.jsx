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
	const [cart, setCart] = useState('loading');
	const [panelOpen, setPanelOpen] = useState(false);
	const [panelInfo, setPanelInfo] = useState({});

	useEffect(() => {
		const source = axios.CancelToken.source();

		async function getStatus() {
			const result = await axios.all([
				axiosApp.get('/auth/status', {
					cancelToken: source.token
				}),
				axiosApp.get('/cart', {
					cancelToken: source.token
				})
			]);
			console.log(result);
			setUserRole(result[0].data.role);
			setCart(result[1].data);
		}

		getStatus();

		return () => {
			source.cancel();
		};
	}, []);

	useEffect(() => {
		const source = axios.CancelToken.source();

		async function updateCart() {
			await axiosApp.post(
				'/cart/update',
				{
					cart: cart.map(item => ({
						productId: item.productId._id,
						amount: item.amount
					}))
				},
				{
					cancelToken: source.token
				}
			);
		}

		if (cart !== 'loading' && cart != null)
			updateCart()
				.then()
				.catch(e => alert('There was an error updating the cart.'));

		return () => {
			source.cancel();
		};
	}, [cart]);

	function addToCart(product) {
		if (cart.find(item => item.productId._id === product._id) == null) {
			setCart(prev => [...prev, { productId: { ...product }, amount: 1 }]);
			alert('Added.');
		} else alert('Item already in cart.');
	}

	// Handle user changing the amount of a product in the cart
	function handleCartChange(id, amount) {
		setCart(prev => {
			if (prev.find(item => item.productId._id === id) == null) return;

			const item = prev.find(item => item.productId._id === id);
			item.amount =
				Number(amount) <= 0
					? 1
					: Number(amount) > item.productId.stock
					? item.productId.stock
					: Number(amount);
			return [...prev];
		});
	}

	function removeCartItem(id) {
		setCart(prev => {
			return prev.filter(item => item.productId._id !== id);
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
