import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import ProjectedField from '../../primitives/ProjectedField';
import EditDebtForm from './EditDebtForm';
import ReviseDebtForm from './ReviseDebtForm';


class DebtContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isExpanded: false,
			isEditFormOpen: false,
			isReviseFormOpen: false,
			expandedRevision: undefined
		};
		this.toggleExpand = this.toggleExpand.bind(this);
		this.openEditForm = this.openEditForm.bind(this);
		this.openReviseForm = this.openReviseForm.bind(this);
		this.toggleRevision = this.toggleRevision.bind(this);
		this.collapseRevision = this.collapseRevision.bind(this);
	}

	toggleExpand() {
		this.setState({
			isExpanded: !this.state.isExpanded,
			isEditFormOpen: false,
			isReviseFormOpen: false,
			expandedRevision: undefined
		});
	}

	openEditForm() {
		this.setState({isEditFormOpen: true});
	}

	openReviseForm() {
		this.setState({isReviseFormOpen: true});
	}

	toggleRevision(ymd) {
		if (this.state.expandedRevision === ymd) {
			this.setState({expandedRevision: undefined});
		} else {
			this.setState({expandedRevision: ymd});
		}
	}

	collapseRevision() {
		this.setState({expandedRevision: undefined});
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
				expandedRevision={this.state.expandedRevision}
				toggleRevision={this.toggleRevision}
				collapseRevision={this.collapseRevision}
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
		expandedRevision,
		toggleRevision,
		collapseRevision,
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
		debtRevisions,
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
		(parseFloat(todayValues.principalBalance) + parseFloat(todayValues.accruedInterest)).toFixed(2)
	) : (
		0
	);

	const userHasPlan = (plan.extraAmount && plan.payoffOrder.length > 0);

	const isDebtInactive = (!isProcessing && userHasPlan && debtBalance === 0);

	const thisDebtRevisions = debtRevisions.filter((revision) => revision.debtId === id);
	thisDebtRevisions.sort((a, b) => {
		if (a.effectiveDate < b.effectiveDate) {
			return -1;
		}
		return 1;
	});

	return (
		<div className={`card${(isDebtInactive ? ' is-inactive' : '')}${(isExpanded ? ' is-expanded' : '')}`} onClick={ () => { !isExpanded && toggleExpand(); } }>
			<h3 className="title is-5">{ name }</h3>
			{ (userHasPlan && !isEditFormOpen && !isReviseFormOpen) && (
				<div className="debt-balance">
					Current balance: $<ProjectedField data={ debtBalance } />
				</div>
			) }
			{ isExpanded && (
				<Fragment>
					{ !(isEditFormOpen || isReviseFormOpen) && (
						<div className="debt-info">
							<div className="base-info">
								<div className="info-header">Base info</div>
								<ul>
									<li>Type: {type}</li>
									<li>Starting balance: ${balance}</li>
									<li>Start date: {startDate}</li>
									<li>Payment day: {paymentDay}</li>
									<li>Minimum payment: ${minimumPayment}</li>
									<li>Interest rate: {interestRate}%</li>
									<li>Interest compounding: {interestCompounding}</li>
								</ul>
							</div>
							{ thisDebtRevisions.length > 0 && (
								<Fragment>
									<div className="revisions-header">Revisions:</div>
									<ol>
										{ thisDebtRevisions.map((revision) => {
											return (
												<li key={revision.effectiveDate}>
													<div className="revision-info">
														<button
															className="revision-header"
															onClick={() => toggleRevision(revision.effectiveDate)}
														>
															{revision.effectiveDate}
														</button>
														{ expandedRevision === revision.effectiveDate && (
															<ul>
																<li>Balance: ${revision.balance}</li>
																<li>Payment day: {revision.paymentDay}</li>
																<li>Minimum payment: ${revision.minimumPayment}</li>
																<li>Interest rate: {revision.interestRate}%</li>
																<li>Interest compounding: {revision.interestCompounding}</li>
															</ul>
														) }
													</div>
												</li>
											);
										}) }
									</ol>
								</Fragment>
							) }
						</div>
					) }
					{ isEditFormOpen && (
						<EditDebtForm debtId={id} handleClose={toggleExpand} />
					) }
					{ isReviseFormOpen && (
						<ReviseDebtForm debtId={id} handleClose={toggleExpand} />
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
