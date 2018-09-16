import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { InputField, OrderField } from '../../primitives/FormFields';
import moment from 'moment';

import './planPage.scss';
import { setPlanExtraAmount, setPlanPayoffOrder, setPlanCreated } from './planPageModule';
import { emptyValidator } from '../../utility/validation';
import { orderDebtsForPayoff } from '../../utility/projection';

const planFormValidation = {
	extraAmount: [ emptyValidator ]
};

class PlanPageContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isPlanOrderShown: props.plan.extraAmount !== undefined,
			isPlanProjectionShown: props.plan.payoffOrder !== undefined
		};
		this.showPlanOrder = this.showPlanOrder.bind(this);
		this.showPlanProjection = this.showPlanProjection.bind(this);
	}

	showPlanOrder() {
		this.setState({ isPlanOrderShown: true });
	}

	showPlanProjection() {
		this.setState({ isPlanProjectionShown: true });
	}

	render() {
		return <PlanPage
			{...this.props}
			isPlanOrderShown={this.state.isPlanOrderShown}
			showPlanOrder={this.showPlanOrder}
			isPlanProjectionShown={this.state.isPlanProjectionShown}
			showPlanProjection={this.showPlanProjection}
		/>
	}
};

const PlanPage = ({
	plan,
	debts,
	setPlanExtraAmount,
	setPlanPayoffOrder,
	setPlanCreated,
	isPlanOrderShown,
	showPlanOrder,
	isPlanProjectionShown,
	showPlanProjection
}) => {
	const today = moment().format('YYYY-MM-DD');

	const initialValues = {
		extraAmount: plan.extraAmount,
		payoffOrder: plan.payoffOrder
	};
	const onSubmit = (values) => {
		const payoffOrder = values.payoffOrder.map((debtName) => {
			// The user has not reordered the debts, so we can just return the ID
			if (typeof debtName === 'number') {
				return debtName;
			}
			return Object.values(debts).find((debt) => debt.name === debtName).id;
		});
		showPlanProjection();
		setPlanCreated(today);
		setPlanExtraAmount(values.extraAmount);
		setPlanPayoffOrder(payoffOrder);
	};

	const multipleDebts = (Object.values(debts).length > 1);
	const optimalDebtOrder = orderDebtsForPayoff(debts);
	let actualDebtOrder;
	if (plan.payoffOrder === undefined) {
		actualDebtOrder = optimalDebtOrder;
	} else {
		actualDebtOrder = plan.payoffOrder.map((debtId) => debts[debtId]);
	}

	const sumOfMinimumPayments = Object.values(debts).reduce((accumulator, debt) => {
		accumulator += debt.minimumPayment;
		return accumulator;
	}, 0);

	return (
		<div className="plan-page">
			<Formik
				initialValues={initialValues}
				validate={validatePlanForm}
				onSubmit={onSubmit}
			>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleBlur,
					handleSubmit,
					setFieldValue,
					setFieldTouched
				}) => {
					return (
						<form onSubmit={handleSubmit}>
							<p className="minimum-payment-projections">{`
								You are spending $${sumOfMinimumPayments} in minimum payments per month. At this rate,
								your debts will be fully paid off on *date*, and you will have paid $*amount* in total.
							`}</p>
							<div className="extra-money-prompt">
								<InputField
									id="extraAmount"
									type="number"
									min={1}
									max={999999}
									value={values.extraAmount}
									label="How much extra money can you put toward your debts?"
									error={errors.extraAmount}
									isTouched={touched.extraAmount}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								{ (!isPlanOrderShown && multipleDebts) && (
									<div className="buttons is-right">
										<button className="button is-primary" onClick={showPlanOrder}>Next</button>
									</div>
								) }
							</div>
							{ isPlanOrderShown && (
								<Fragment>
									{ multipleDebts && (
										<div className="payoff-order-prompt">
											<p>
												You'll save the most money by paying off your debts in this order: {
													optimalDebtOrder.map((debt) => debt.name).join(', ')
												}. But you can rearrange them here if you want by dragging and dropping:
											</p>
											<OrderField
												id="payoffOrder"
												label="Payoff order"
												items={actualDebtOrder.map((debt) => debt.name)}
												error={errors.payoffOrder}
												isTouched={touched.payoffOrder}
												setFieldValue={setFieldValue}
												setFieldTouched={setFieldTouched}
											/>
										</div>
									) }
									{ !isPlanProjectionShown ? (
										<div className="buttons is-right">
											<button className="button is-primary" type="submit">Next</button>
										</div>
									) : (
										<p>With this plan your debts will be paid off x months sooner, on *date*, and you will have saved $*amount* in interest.</p>
									) }
								</Fragment>
							) }
							{ isPlanProjectionShown && (
								<div className="buttons is-centered">
									<button className="button is-primary" type="submit">Save plan</button>
								</div>
							) }
						</form>
					);
				} }
			</Formik>
		</div>
	);
}

const validatePlanForm = (values) => {
	const errors = Object.entries(planFormValidation).reduce((accumulator, [field, validators]) => {
		const allResults = validators.reduce((accumulator, validator) => {
			const result = validator(values[field]);
			if (result) {
				accumulator.push(result);
			}
			return accumulator;
		}, []);
		if (allResults.length) {
			accumulator[field] = allResults.join(' ');
		}
		return accumulator;
	}, {});
	return errors;
};

const mapStateToProps = (state) => {
	return {
		debts: state.debts,
		plan: state.plan
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setPlanExtraAmount: (amount) => dispatch(setPlanExtraAmount(amount)),
		setPlanPayoffOrder: (order) => dispatch(setPlanPayoffOrder(order)),
		setPlanCreated: (date) => dispatch(setPlanCreated(date))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PlanPageContainer);
