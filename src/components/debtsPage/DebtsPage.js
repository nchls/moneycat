import React from 'react';
import { connect } from 'react-redux';

import './debtsPage.scss';
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
		this.hideNewDebtForm = this.hideNewDebtForm.bind(this);
	}

	showNewDebtForm() {
		this.setState({ isNewDebtFormShown: true });
	}

	hideNewDebtForm() {
		this.setState({ isNewDebtFormShown: false });
	}

	render() {
		return <DebtsPage
			{...this.props}
			isNewDebtFormShown={this.state.isNewDebtFormShown}
			showNewDebtForm={this.showNewDebtForm}
			hideNewDebtForm={this.hideNewDebtForm}
		/>
	}
}

const DebtsPage = ({ debts, createDebt, isNewDebtFormShown, showNewDebtForm, hideNewDebtForm }) => {
	return (
		<div className="debts-page cards-list is-clearfix">
			{ Object.entries(debts).map(([id, debt]) => {
				return (
					<Debt debt={debt} key={id} />
				);
			}) }
			{ !isNewDebtFormShown ? (
				<div className="card">
					<button className="button is-primary" onClick={showNewDebtForm}>
						Create a debt
					</button>
				</div>
			) : (
				<CreateDebtForm handleCancel={hideNewDebtForm} />
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
