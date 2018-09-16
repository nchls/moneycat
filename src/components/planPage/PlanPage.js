import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Formik, Field } from 'formik';
import moment from 'moment';

import './planPage.scss';
import { urlRoot } from '../app/App';
import { InputField, OrderField } from '../../primitives/FormFields';
import { setPlanExtraAmount, setPlanPayoffOrder, setPlanCreated } from './planPageModule';
import { emptyValidator } from '../../utility/validation';
import { orderDebtsForPayoff } from '../../utility/projection';
import ProjectedField from '../../primitives/ProjectedField';

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
	projection,
	setPlanExtraAmount,
	setPlanPayoffOrder,
	setPlanCreated,
	isPlanOrderShown,
	showPlanOrder,
	isPlanProjectionShown,
	showPlanProjection
}) => {
	const today = moment().format('YYYY-MM-DD');

	if (Object.values(debts).length === 0) {
		return (
			<div className="plan-page no-debts">
				<p>It looks like you haven't created any debts yet. Congratulations!</p>
				<p>
					If, one day, you do acquire a debt you'd like to track, head on over to
					the <Link to={`${urlRoot}/debts`}>debts page</Link>, add it there, and come on back this way.
				</p>
			</div>
		);
	}

	const initialValues = {
		extraAmount: plan.extraAmount,
		payoffOrder: plan.payoffOrder
	};
	const onSubmit = (values) => {
		if (!values.payoffOrder) {
			return false;
		}
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
	const minimumPayoffDate = moment(projection.minimumPayoffDate, 'YYYY-MM-DD');
	const minimumPaymentTotal = projection.minimumPaymentTotal;

	const planSavings = (parseFloat(minimumPaymentTotal) - parseFloat(projection.paymentTotal)).toFixed(2);

	const planProjectedCompletionYMD = Object.values(projection.payoffDates).reduce((accumulator, ymd) => {
		if (ymd > accumulator) {
			accumulator = ymd;
		}
		return accumulator;
	}, '1980-01-01');
	const planProjectedCompletionDate = moment(planProjectedCompletionYMD, 'YYYY-MM-DD');

	const planTimeSavings = moment.duration(planProjectedCompletionDate.diff(minimumPayoffDate)).humanize();

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
							<p className="minimum-payment-projections">
								{`
									You are spending $${sumOfMinimumPayments} in minimum payments per month. At this rate,
									your debts will be fully paid off on
								`}
								<ProjectedField data={minimumPayoffDate.format('MMMM Do YYYY')} />
								, and you will have paid $<ProjectedField data={minimumPaymentTotal} /> in total.
							</p>
							<div className="extra-money-prompt">
								<Field
									name="extraAmount"
									component={InputField}
									fieldProps={{
										type: 'number',
										min: 0.01,
										max: 999999,
										step: 0.01
									}}
									wrapperProps={{
										label: 'How much extra money can you put toward your debts per month?'
									}}
								/>

								{ !isPlanOrderShown && (
									<div className="buttons is-right">
										<button className="button is-primary" onClick={showPlanOrder}>Next</button>
									</div>
								) }
							</div>
							{ isPlanOrderShown && (
								<Fragment>
									<div className="payoff-order-prompt">
										{ multipleDebts ? (
											<p>
												You'll save the most money by paying off your debts in this order: {
													optimalDebtOrder.map((debt) => debt.name).join(', ')
												}. But you can rearrange them here if you want by dragging and dropping:
											</p>
										) : (
											<p>
												Normally, we'd tell you here in what order you should pay off your
												debts to save the most money. But there's only so many ways to order
												a single item!
											</p>
										) }
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
									{ !isPlanProjectionShown ? (
										<div className="buttons is-right">
											<button className="button is-primary" type="submit">Next</button>
										</div>
									) : (
										<p>
											With this plan, your debts will be paid off <ProjectedField data={planTimeSavings} /> sooner,
											on <ProjectedField data={planProjectedCompletionDate.format('MMMM Do YYYY')} />, and
											you will have saved $<ProjectedField data={planSavings} /> in interest.
										</p>
									) }
								</Fragment>
							) }
							{ isPlanProjectionShown && (
								<Fragment>
									<div className="buttons is-centered">
										<button className="button is-primary" type="submit">Save plan</button>
									</div>
									<p>
										Everything look good here? When you're ready, head over
										to <Link to={`${urlRoot}/`}>the Dashboard page</Link> to get a high-level view
										of your progress.
									</p>
								</Fragment>
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
		plan: state.plan,
		projection: state.projection
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
