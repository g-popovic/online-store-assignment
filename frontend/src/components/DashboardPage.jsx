import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosApp from '../axiosApp';
import moment from 'moment';

export default function DashboardPage() {
	const [stats, setStats] = useState([]);

	useEffect(() => {
		const source = axios.CancelToken.source();

		async function getStats() {
			try {
				setStats(
					(
						await axiosApp.get('/products/sales-statistics', {
							cancelToken: source.token
						})
					).data
				);
			} catch (err) {
				alert('There was an error');
				console.log(err);
			}
		}

		getStats();

		return () => {
			source.cancel();
		};
	}, []);

	return (
		<div className="page-container">
			<h1>Admin Dashboard</h1>
			<div className="mt-5 sales-container">
				<h4 className="mb-3 mr-5">Sales last 30 days</h4>
				<p className="text-muted">
					(This should be a Graph Chart,
					<br />
					but I don't have time for that)
				</p>
				<hr />
				<ul>
					{stats.map(item => (
						<li className="mb-2">
							{moment(item[0] * 1000).format('DD MMM')}:{' '}
							<strong>
								${(Math.round(item[1]) / 100).toFixed(2)}
							</strong>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
