import React from 'react';
import { connect } from 'react-redux';

import { createDebt } from '../debt/debtModule';


const DebtsPage = ({ createDebt }) => {
	const debtProps = {
		id: 47,
		name: 'Eternal Mortgage',
		type: 'mortgage',
		balance: 247000.42,
		startDate: '2017-01-01',
		minimumPayment: 1200.88,
		interestRate: 4.25,
		interestCompounding: 'compound'
	};
	return (
		<div className="debts">
			<p>
				<button className="button" onClick={() => createDebt(debtProps)}>
					Create a debt
				</button>
			</p>
		</div>
	);
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = (dispatch) => {
	return {
		createDebt: (debt) => dispatch(createDebt(debt))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DebtsPage);
