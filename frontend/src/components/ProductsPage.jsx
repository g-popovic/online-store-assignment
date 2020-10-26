import React, { useEffect, useState } from 'react';
import Product from './Product';
import axios from 'axios';
import axiosApp from '../axiosApp';

export default function ProductsPage(props) {
	const [products, setProducts] = useState([]);
	const [search, setSearch] = useState('');
	const [sortByStock, setSortByStock] = useState(false);

	async function getProducts(token) {
		setProducts(
			(
				await axiosApp.get(
					`/products?name=${search}&shouldSortByStock=${
						sortByStock ? '1' : ''
					}`,
					{
						cancelToken: token
					}
				)
			).data
		);
	}

	useEffect(() => {
		const source = axios.CancelToken.source();

		getProducts(source.token);

		return () => {
			source.cancel();
		};
	}, [sortByStock]);

	return (
		<div className="page-container">
			<label>Search: </label>
			<div className="input-group mb-3">
				<input
					type="text"
					placeholder="Find Product"
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<div className="input-group-append">
					<button
						className="btn btn-primary"
						type="button"
						onClick={() => getProducts(null)}>
						Search
					</button>
				</div>
			</div>
			{props.userRole === 'admin' ? (
				<label>
					Lowest Stock First{' '}
					<input
						type="checkbox"
						value={sortByStock}
						onChange={() => setSortByStock(prev => !prev)}
					/>
				</label>
			) : null}

			<div className="row products">
				{products.map(product => (
					<Product
						key={product._id}
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
