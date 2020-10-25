import React, { useState } from 'react';

export default function Product(props) {
	return (
		<div class="card col-lg-3 m-3">
			<img
				src={props.product.imagePath}
				class="card-img-top"
				alt="..."
				onError={e =>
					(e.target.src =
						'https://raw.githubusercontent.com/g-popovic/dope-kicks-v2/master/frontend/src/images/product-placeholder.jpg')
				}
			/>
			<div class="card-body">
				<h5 class="card-title">{props.product.name}</h5>
				<p>
					<strong>{props.product.stock}</strong> left in stock
				</p>
				<p>
					Price:{' '}
					<strong>
						${(Math.round(props.product.price) / 100).toFixed(2)}
					</strong>
				</p>
				<button
					onClick={() =>
						props.product.stock <= 0
							? null
							: props.addToCart(props.product)
					}
					class="btn btn-primary">
					{props.product.stock <= 0 ? 'Out of Stock' : 'Add To Cart'}
				</button>
				{props.isAdmin ? (
					<button
						onClick={() => props.editProduct(props.product)}
						class="btn btn-secondary ml-3">
						Edit
					</button>
				) : null}
			</div>
		</div>
	);
}
