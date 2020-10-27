import React, { useState } from 'react';
import axiosApp from '../axiosApp';

export default function EditPanel(props) {
	const [name, setName] = useState(props.name);
	const [price, setPrice] = useState(props.price);
	const [imagePath, setImagePath] = useState(props.imagePath);
	const [stock, setStock] = useState(props.stock);
	const [category, setCategory] = useState(props.category || 'misc');

	async function addProduct() {
		try {
			await axiosApp.post('/products/new', {
				name,
				price,
				imagePath,
				stock,
				category
			});
		} catch (err) {
			console.log(err);
			alert('There was an unexpected error.');
		}
		props.close();
	}

	async function deleteProduct() {
		await axiosApp.delete('/products/' + props.id);
		props.close();
	}

	async function updateProduct() {
		try {
			await axiosApp.post('/products/edit/' + props.id, {
				name,
				price,
				imagePath,
				stock,
				category
			});
		} catch (err) {
			console.log(err);
			alert('There was an unexpected error.');
		}
		props.close();
	}

	return (
		<div className="edit-panel">
			<label>Name</label>
			<input
				value={name}
				onChange={e => setName(e.target.value)}
				className="form-control mb-2"
				placeholder="Name"
			/>
			<label>Price</label>
			<input
				value={price / 100}
				onChange={e =>
					setPrice(Number(e.target.value) > 0 ? e.target.value * 100 : 1)
				}
				className="form-control mb-2"
				type="number"
				min={1}
				placeholder="Price"
			/>
			<label>Image Link</label>
			<input
				value={imagePath}
				onChange={e => setImagePath(e.target.value)}
				className="form-control mb-2"
				placeholder="Image Link"
			/>
			<label>Left In Stock</label>
			<input
				value={stock}
				onChange={e => {
					console.log(e.target.value);
					if (Number(e.target.value) < 0) return setStock(0);
					setStock(e.target.value);
				}}
				className="form-control"
				placeholder="Stock"
				type="number"
			/>
			<br />
			<label className="mr-2" htmlFor="categories">
				Select Category{' '}
			</label>
			<select
				className="mb-4"
				name="categories"
				id="categories"
				value={category}
				onChange={e => setCategory(e.target.value)}>
				<option value="food">Food</option>
				<option value="misc">Misc</option>
				<option value="clothes">Clothes</option>
				<option value="tech">Tech</option>
			</select>
			<div className="mt-3 text-center">
				<button className="btn btn-secondary mr-3" onClick={props.close}>
					Cancel
				</button>
				{props.name == null ? null : (
					<button className="btn btn-danger mr-3" onClick={deleteProduct}>
						Delete
					</button>
				)}
				<button
					className="btn btn-primary"
					onClick={props.name == null ? addProduct : updateProduct}>
					Save
				</button>
			</div>
		</div>
	);
}
