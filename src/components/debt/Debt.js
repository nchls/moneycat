import React from 'react';
import { connect } from 'react-redux';


const Debt = (props) => {
	const {
		debt: {
			id,
			name,
			type,
			balance,
			startDate,
			minimumPayment,
			interestRate,
			interestCompounding
		}
	} = props;
	return (
		<div className="tile is-child">
			<p>Name: { name }</p>
			<p>Type: { type }</p>
			<p>Starting balance: { balance }</p>
			<p>Start date: { startDate }</p>
			<p>Minimum payment: { minimumPayment }</p>
			<p>Interest rate: { interestRate }</p>
			<p>Interest compounding: { interestCompounding }</p>
		</div>
	);
}

export default Debt;
