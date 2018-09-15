import React from 'react';
import { connect } from 'react-redux';

import Debt from '../debt/Debt';
import { createDebt } from '../debt/debtModule';


const DebtsPage = ({ debts, createDebt }) => {
	const debtProps = {
		id: Date.now(),
		name: 'Eternal Mortgage',
		type: 'mortgage',
		balance: 247000.42,
		startDate: '2017-01-01',
		minimumPayment: 1200.88,
		interestRate: 4.25,
		interestCompounding: 'compound'
	};
	return (
		<div>
			<div className="tile is-ancestor">
				<div className="tile is-parent">
					{ Object.entries(debts).map(([id, debt]) => {
						return (
							<Debt debt={debt} />
						);
					}) }
				</div>
			</div>
			<p>
				<button className="button" onClick={() => createDebt(debtProps)}>
					Create a debt
				</button>
			</p>
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		debts: state.debts
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		createDebt: (debt) => dispatch(createDebt(debt))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DebtsPage);
