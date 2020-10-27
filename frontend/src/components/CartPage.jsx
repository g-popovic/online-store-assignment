import React, { useState } from 'react';
import axiosApp from '../axiosApp';
import StripeCheckout from 'react-stripe-checkout';

export default function CartPage(props) {
	const [isLoading, setIsLoading] = useState(false);
	const publicStripeToken =
		'pk_test_51HRa5mKDvtytb8inFLTYEJCOD0z05DIXv6a65HvHvsD5IjlDh31UQmqx1MRZFe0ybZWJNVBO6GooMjafXCYf4Nih00XLgKHxrH';
	const totalPrice =
		props.cart === 'loading' || props.cart == null
			? 0
			: props.cart.reduce(
					(total, item) => total + item.amount * item.productId.price,
					0
			  );

	async function purchase(token) {
		setIsLoading(true);
		try {
			await axiosApp.post('/cart/purchase', {
				cart: props.cart.map(item => ({
					productId: item.productId._id,
					amount: item.amount
				})),
				token
			});
			alert('Purchase Successful!');
			props.clearCart();
		} catch (err) {
			console.log(err);
			alert('Something went wrong...');
			window.location.reload();
		}
		setIsLoading(false);
	}

	if (props.cart === 'loading' || props.cart == null) return <h3>Loading...</h3>;

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
							<p
								onClick={() =>
									props.removeCartItem(item.productId._id)
								}>
								X
							</p>
							<p>{item.productId.name}</p>
							<p>
								$
								{(Math.round(item.productId.price) / 100).toFixed(2)}
							</p>
							<input
								type="number"
								className="form-control"
								defaultValue={item.amount}
								min={1}
								onChange={e => {
									props.handleChange(
										item.productId._id,
										e.target.value
									);
								}}
							/>
						</div>
					))}
				</div>
			</div>
			<p>
				Total: <strong>${(Math.round(totalPrice) / 100).toFixed(2)}</strong>
			</p>

			{props.cart.length ? (
				isLoading ? (
					<strong>Loading...</strong>
				) : (
					<StripeCheckout
						amount={totalPrice}
						stripeKey={publicStripeToken}
						token={purchase}
						name="Super Store">
						<button className="btn btn-primary">Purchase</button>
					</StripeCheckout>
				)
			) : (
				<p>Please add something to cart.</p>
			)}
		</div>
	);
}
