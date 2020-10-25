import React, { useState } from 'react';
import axiosApp from '../axiosApp';

export default function EditPanel(props) {
	const [name, setName] = useState(props.name);
	const [price, setPrice] = useState(props.price);
	const [imagePath, setImagePath] = useState(props.imagePath);

	async function addProduct() {
		try {
			await axiosApp.post('/products/new', { name, price, imagePath });
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
				imagePath
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
			<label>Price (IN CENTS)</label>
			<input
				value={price}
				onChange={e =>
					setPrice(Number(e.target.value) > 0 ? e.target.value : 1)
				}
				className="form-control mb-2"
				type="number"
				min={1}
				placeholder="Price (IN CENTS)"
			/>
			<label>Image Link</label>
			<input
				value={imagePath}
				onChange={e => setImagePath(e.target.value)}
				className="form-control"
				placeholder="Image Link"
			/>
			<div className="mt-3 text-center">
				<button className="btn btn-secondary mr-3" onClick={props.close}>
					Cancel
				</button>
				<button className="btn btn-danger mr-3" onClick={deleteProduct}>
					Delete
				</button>
				<button
					className="btn btn-primary"
					onClick={props.name == null ? addProduct : updateProduct}>
					Save
				</button>
			</div>
		</div>
	);
}
