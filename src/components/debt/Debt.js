import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import ProjectedField from '../../primitives/ProjectedField';
import EditDebtForm from './EditDebtForm';


class DebtContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isExpanded: false,
			isEditFormOpen: false,
			isReviseFormOpen: false
		};
		this.toggleExpand = this.toggleExpand.bind(this);
		this.openEditForm = this.openEditForm.bind(this);
		this.openReviseForm = this.openReviseForm.bind(this);
	}

	toggleExpand() {
		this.setState({
			isExpanded: !this.state.isExpanded,
			isEditFormOpen: false,
			isReviseFormOpen: false
		});
	}

	openEditForm() {
		this.setState({isEditFormOpen: true});
	}

	openReviseForm() {
		this.setState({isReviseFormOpen: true});
	}

	render() {
		return (
			<Debt
				{...this.props}
				isExpanded={this.state.isExpanded}
				toggleExpand={this.toggleExpand}
				isEditFormOpen={this.state.isEditFormOpen}
				openEditForm={this.openEditForm}
				isReviseFormOpen={this.state.isReviseFormOpen}
				openReviseForm={this.openReviseForm}
			/>
		);
	}
}

const Debt = (props) => {
	const {
		isExpanded,
		toggleExpand,
		openEditForm,
		isEditFormOpen,
		openReviseForm,
		isReviseFormOpen,
		debt: {
			id,
			name,
			type,
			balance,
			startDate,
			paymentDay,
			minimumPayment,
			interestRate,
			interestCompounding
		},
		projection: {
			ledger,
			isProcessing
		},
		plan
	} = props;

	const todayYMD = moment().format('YYYY-MM-DD');
	let todayValues = {};
	if (ledger[todayYMD] && ledger[todayYMD][id]) {
		todayValues = ledger[todayYMD][id];
	}
	const debtBalance = todayValues.principalBalance ? (
		(parseFloat(todayValues.principalBalance) + parseFloat(todayValues.accruedInterest))
	) : (
		0
	);

	const userHasPlan = (plan.extraAmount && plan.payoffOrder.length > 0);

	const isDebtInactive = (!isProcessing && userHasPlan && debtBalance === 0);

	return (
		<div className={`card${(isDebtInactive ? ' is-inactive' : '')}`} onClick={ () => { !isExpanded && toggleExpand(); } }>
			<h3 className="title is-5">{ name }</h3>
			{ (userHasPlan && !isEditFormOpen && !isReviseFormOpen) && (
				<div className="debt-balance">
					Current balance: $<ProjectedField data={ debtBalance } />
				</div>
			) }
			{ isExpanded && (
				<Fragment>
					{ isEditFormOpen && (
						<EditDebtForm debtId={id} handleClose={toggleExpand} />
					) }
					{ isReviseFormOpen && (
						<p>Revise Form</p>
					) }
					<div className="buttons is-right">
						{ !(isEditFormOpen || isReviseFormOpen) && (
								<Fragment>
									<button className="button is-text" onClick={toggleExpand}>Close</button>
									<button className="button is-info" onClick={openEditForm}>Edit</button>
									<button className="button is-primary" onClick={openReviseForm}>Revise</button>
								</Fragment>
							)
						}
					</div>
				</Fragment>
			) }
		</div>
	);
}

export default DebtContainer;
