import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { urlRoot } from '../app/App';
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

const DebtsPage = ({ debts, debtRevisions, projection, plan, createDebt, isNewDebtFormShown, showNewDebtForm, hideNewDebtForm }) => {
	return (
		<div className="debts-page">
			<h2 className="title is-4">Debts</h2>
			<div className="page-info">
				<p>
					Here is where you can add and manage your debts. If you need to modify a debt on a certain
					effective date, such as a change in minimum payment, use the "Revise" button. Other properties
					like the debt's name can be edited with the "Edit" button.
				</p>
				{ !plan.extraAmount && (
					<p>
						When you're done adding debts, head over to <Link to={`${urlRoot}/plan`}>the plan page</Link>.
					</p>
				) }
			</div>
			<div className="cards-list">
				{ Object.entries(debts).map(([id, debt]) => {
					return (
						<Debt debt={debt} debtRevisions={debtRevisions} projection={projection} plan={plan} key={id} />
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
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		debts: state.debts,
		debtRevisions: state.debtRevisions,
		projection: state.projection,
		plan: state.plan
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		createDebt: (debt) => dispatch(createDebt(debt))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DebtsPageContainer);
