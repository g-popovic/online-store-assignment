import React from 'react';
import axiosApp from '../axiosApp';

export default function CartPage(props) {
	async function purchase() {
		console.log(await axiosApp.post('/cart/purchase', { cart: props.cart }));
		props.clearCart();
		alert('Purchase Successful!');
	}

	return (
		<div className="page-container cart-page">
			<h1>Cart</h1>
			<div style={{ width: '100%', overflow: 'auto' }}>
				<div className="cart-items">
					<div className="cart-item">
						<p></p>
						<p>Product</p>
						<p>Price</p>
						<p>Amount</p>
					</div>
					{props.cart.map(item => (
						<div className="cart-item">
							<p onClick={() => props.removeCartItem(item._id)}>X</p>
							<p>{item.name}</p>
							<p>${(Math.round(item.price) / 100).toFixed(2)}</p>
							<input
								type="number"
								className="form-control"
								defaultValue={item.amount}
								min={1}
								onChange={e => {
									props.handleChange(item._id, e.target.value);
								}}
							/>
						</div>
					))}
				</div>
			</div>
			<p>
				Total:{' '}
				<strong>
					$
					{(
						Math.round(
							props.cart.reduce(
								(total, item) => total + item.amount * item.price,
								0
							)
						) / 100
					).toFixed(2)}
				</strong>
			</p>
			<button className="btn btn-primary" onClick={purchase}>
				Purchase
			</button>
		</div>
	);
}
