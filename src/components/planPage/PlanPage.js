import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { InputField } from '../../primitives/FormFields';

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
			isPlanOrderShown: false
		};
		this.showPlanOrder = this.showPlanOrder.bind(this);
	}

	showPlanOrder() {
		this.setState({ isPlanOrderShown: true });
	}

	render() {
		return <PlanPage
			{...this.props}
			isPlanOrderShown={this.state.isPlanOrderShown}
			showPlanOrder={this.showPlanOrder}
		/>
	}
};

const PlanPage = ({
	debts,
	setPlanExtraAmount,
	setPlanPayoffOrder,
	setPlanCreated,
	isPlanOrderShown,
	showPlanOrder
}) => {
	const initialValues = {};
	const onSubmit = (values) => {
		setPlanExtraAmount(values.extraAmount);
	};

	const orderedDebts = orderDebtsForPayoff(debts);

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
						<Fragment>
							<div className="extra-money-prompt">
								<InputField
									id="extraAmount"
									type="number"
									min={1}
									max={999999}
									label="How much extra money can you put toward your debts?"
									error={errors.extraAmount}
									isTouched={touched.extraAmount}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								{ !isPlanOrderShown && (
									<button className="button is-primary" onClick={showPlanOrder}>Next</button>
								) }
							</div>
							{ isPlanOrderShown && (
								<Fragment>
									{ Object.values(debts).length > 1 && (
										<div className="payoff-order-prompt">
											<p>
												You'll save the most money by paying off your debts in this order: {
													orderedDebts.map((debt) => debt.name).join(', ')
												}. But you can rearrange them if you want.
											</p>
										</div>
									) }
								</Fragment>
							) }
						</Fragment>
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
		debts: state.debts
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setPlanExtraAmount: (amount) => dispatch(setPlanExtraAmount(amount)),
		setPlanPayoffOrder: (order) => dispatch(setPlanPayoffOrder(order)),
		setPlanCreated: (date) => dispatch(setPlanExtraAmount(date))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PlanPageContainer);
