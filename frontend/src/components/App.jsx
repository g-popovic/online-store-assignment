import React, { useEffect, useState } from 'react';
import LoginPage from './LoginPage';
import Navbar from './Navbar';
import ProductsPage from './ProductsPage';
import CartPage from './CartPage';
import EditPanel from './EditPanel';
import axios from 'axios';
import axiosApp from '../axiosApp';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

export default function App() {
	const [userRole, setUserRole] = useState(null);
	const [cart, setCart] = useState([]);
	const [panelOpen, setPanelOpen] = useState(false);
	const [panelInfo, setPanelInfo] = useState({});

	useEffect(() => {
		const source = axios.CancelToken.source();

		async function getStatus() {
			setUserRole(
				(await axiosApp.get('/auth/status', { cancelToken: source.token }))
					.data
			);
		}

		getStatus();

		return () => {
			source.cancel();
		};
	}, []);

	function addToCart(product) {
		if (cart.find(item => item._id === product._id) == null) {
			setCart(prev => [...prev, { ...product, amount: 1 }]);
		}
	}

	// Handle user changing the amount of a product in the cart
	function handleCartChange(id, amount) {
		setCart(prev => {
			if (prev.find(item => item._id === id) == null) return;

			prev.find(item => item._id === id).amount =
				Number(amount) > 0 ? Number(amount) : 1;
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
			<Navbar openPanel={() => setPanelOpen(true)} />
			{panelOpen ? (
				<EditPanel
					close={() => {
						setPanelOpen(false);
						setPanelInfo({});
					}}
					id={panelInfo._id}
					name={panelInfo.name}
					price={panelInfo.price}
					imagePath={panelInfo.imagePath}
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
				<Route component={() => <h1>Error: 404 Not Found</h1>} />
			</Switch>
		</Router>
	);
}
