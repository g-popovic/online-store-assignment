import React, { useEffect, useState } from 'react';
import Product from './Product';
import axios from 'axios';
import axiosApp from '../axiosApp';

export default function ProductsPage(props) {
	const [products, setProducts] = useState([]);
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('');
	const [sortBy, setSortBy] = useState('');

	async function getProducts(token) {
		setProducts(
			(
				await axiosApp.get(
					`/products?name=${search}&category=${category}&sortBy=${sortBy}`,
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
	}, [sortBy, category]);

	return (
		<div className="page-container">
			<div className="d-lg-flex align-items-center justify-content-start mb-5">
				<div className="input-group mb-3 mr-5" style={{ width: 'auto' }}>
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

				<div className="d-flex">
					<div className="mr-4">
						<label className="mr-2" htmlFor="categories">
							Sory By
						</label>
						<select
							className="mb-4"
							name="categories"
							id="categories"
							value={sortBy}
							onChange={e => setSortBy(e.target.value)}>
							<option value="">Date Added</option>
							<option value="priceAsc">Price Ascending</option>
							<option value="priceDes">Price Descending</option>
							{props.userRole === 'admin' ? (
								<option value="stock">Lowest Stock</option>
							) : null}
						</select>
					</div>

					<div>
						<label className="mr-2" htmlFor="categories">
							Select Category{' '}
						</label>
						<select
							className="mb-4"
							name="categories"
							id="categories"
							value={category}
							onChange={e => setCategory(e.target.value)}>
							<option value="">All</option>
							<option value="food">Food</option>
							<option value="misc">Misc</option>
							<option value="clothes">Clothes</option>
							<option value="tech">Tech</option>
						</select>
					</div>
				</div>
			</div>

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
