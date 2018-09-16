import React from 'react';
import { connect } from 'react-redux';
import { Formik, Field } from 'formik';

import { DEBT_TYPES, COMPOUNDING_TYPES, createDebt, getNewDebtId } from './debtModule';
import { setPlanPayoffOrder } from '../planPage/planPageModule';
import { InputField, SelectField, DateField } from '../../primitives/FormFields';
import { emptyValidator } from '../../utility/validation';

const debtFormValidation = {
	name: [ emptyValidator ],
	type: [ emptyValidator ],
	balance: [ emptyValidator ],
	startDate: [ emptyValidator ],
	paymentDay: [ emptyValidator ],
	minimumPayment: [ emptyValidator ],
	interestRate: [ emptyValidator ],
	interestCompounding: [ emptyValidator ]
};

const CreateDebtForm = ({ debts, plan, planRevisions, setPlanPayoffOrder, handleCancel, createDebt }) => {
	const initialValues = {
		name: '',
		type: DEBT_TYPES[0].slug,
		balance: '',
		startDate: '',
		paymentDay: '',
		minimumPayment: '',
		interestRate: '',
		interestCompounding: COMPOUNDING_TYPES[0].slug
	};
	const onSubmit = (values, { setSubmitting }) => {
		values.startDate = values.startDate.format('YYYY-MM-DD');

		// Add the debt
		const newDebtId = getNewDebtId(debts);
		values.id = newDebtId;
		createDebt(values);

		// Add the new debt to all existing plan and plan revisions
		const payoffOrder = plan.payoffOrder;
		if (payoffOrder) {
			payoffOrder.push(newDebtId);
			setPlanPayoffOrder(payoffOrder);
		}

		setSubmitting(false);
		handleCancel();
	};

	return (
		<div className="card create-debt-form">
			<Formik
				initialValues={initialValues}
				validate={validateCreateDebtForm}
				onSubmit={onSubmit}
			>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleBlur,
					handleSubmit,
					isSubmitting,
					setFieldValue,
					setFieldTouched
				}) => {
					return (
						<form onSubmit={handleSubmit}>
							<Field
								name="name"
								component={InputField}
								fieldProps={{
									type: 'text'
								}}
								wrapperProps={{
									label: 'Name',
									helpText: 'Just for your own reference.'
								}}
							/>
							<Field
								name="type"
								component={SelectField}
								choices={DEBT_TYPES}
								wrapperProps={{
									label: 'Type'
								}}
							/>
							<Field
								name="balance"
								component={InputField}
								fieldProps={{
									type: 'number',
									min: 1,
									max: 99999999,
									step: 0.01
								}}
								wrapperProps={{
									label: 'Starting balance'
								}}
							/>
							<DateField
								id="startDate"
								label="Start date"
								helpText={`
									To be specific, this is the date on which the debt begins to accrue interest. Or it
									can be any date on which you want to start tracking progress, so long as you set
									the starting balance to what it was on this date.
								`}
								error={errors.startDate}
								isTouched={touched.startDate}
								setFieldValue={setFieldValue}
								setFieldTouched={setFieldTouched}
							/>
							<Field
								name="paymentDay"
								component={InputField}
								fieldProps={{
									type: 'number',
									min: 1,
									max: 28,
									step: 1
								}}
								wrapperProps={{
									label: 'Payment day',
									helpText: 'The day of the month on which payments are due'
								}}
							/>
							<Field
								name="minimumPayment"
								component={InputField}
								fieldProps={{
									type: 'number',
									min: 1,
									max: 99999,
									step: 0.01
								}}
								wrapperProps={{
									label: 'Minimum payment'
								}}
							/>
							<Field
								name="interestRate"
								component={InputField}
								fieldProps={{
									type: 'number',
									min: 0.01,
									max: 99,
									step: 0.01
								}}
								wrapperProps={{
									label: 'Interest rate'
								}}
							/>
							<Field
								name="interestCompounding"
								component={SelectField}
								choices={COMPOUNDING_TYPES}
								wrapperProps={{
									label: 'Interest compounding',
									helpText: `
										Most debts compound interest monthly. Exceptions include some student loans, where
										accrued interest is never added back to the principal.
									`
								}}
							/>
							<div className="buttons is-right">
								<button className="button is-text" disabled={isSubmitting} onClick={handleCancel}>
									Cancel
								</button>
								<button className="button is-primary" type="submit" disabled={isSubmitting}>
									Create
								</button>
							</div>
						</form>
					);
				} }
			</Formik>
		</div>
	);
};

const validateCreateDebtForm = (values) => {
	const errors = Object.entries(debtFormValidation).reduce((accumulator, [field, validators]) => {
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
		planRevisions: state.planRevisions
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		createDebt: (debt) => dispatch(createDebt(debt)),
		setPlanPayoffOrder: (payoffOrder) => dispatch(setPlanPayoffOrder(payoffOrder))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateDebtForm);
