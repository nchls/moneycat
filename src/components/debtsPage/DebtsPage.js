import React from 'react';
import { connect } from 'react-redux';

import Debt from '../debt/Debt';
import { createDebt } from '../debt/debtModule';
import CreateDebtForm from '../debt/CreateDebtForm';


class DebtsPageContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isNewDebtFormShown: false
		};
		this.showNewDebtForm = this.showNewDebtForm.bind(this);
	}

	showNewDebtForm() {
		this.setState({ isNewDebtFormShown: true });
	}

	render() {
		return <DebtsPage
			{...this.props}
			isNewDebtFormShown={this.state.isNewDebtFormShown}
			showNewDebtForm={this.showNewDebtForm}
		/>
	}
}

const DebtsPage = ({ debts, createDebt, isNewDebtFormShown, showNewDebtForm }) => {
	return (
		<div>
			<div className="tile is-ancestor">
				<div className="tile is-parent">
					{ Object.entries(debts).map(([id, debt]) => {
						return (
							<Debt debt={debt} key={id} />
						);
					}) }
				</div>
			</div>
			{ !isNewDebtFormShown ? (
				<p>
					<button className="button is-primary" onClick={showNewDebtForm}>
						Create a debt
					</button>
				</p>
			) : (
				<CreateDebtForm />
			) }
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

export default connect(mapStateToProps, mapDispatchToProps)(DebtsPageContainer);
