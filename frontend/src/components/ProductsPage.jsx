import React, { useEffect, useState } from 'react';
import Product from './Product';
import axios from 'axios';
import axiosApp from '../axiosApp';

export default function ProductsPage(props) {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const source = axios.CancelToken.source();

		async function getProducts() {
			setProducts(
				(await axiosApp.get('/products', { cancelToken: source.token })).data
			);
		}

		getProducts();

		return () => {
			source.cancel();
		};
	}, []);

	return (
		<div className="page-container">
			<div className="row products">
				{products.map(product => (
					<Product
						product={product}
						addToCart={props.addToCart}
						editProduct={props.editProduct}
						isAdmin={props.userRole === 'admin'}
					/>
				))}
			</div>
		</div>
	);
}
