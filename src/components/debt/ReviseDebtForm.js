import React from 'react';
import { connect } from 'react-redux';
import { Formik, Field } from 'formik';
import moment from 'moment';

import { COMPOUNDING_TYPES } from './debtModule';
import { createDebtRevision } from './debtRevisionModule';
import { InputField, SelectField, DateField } from '../../primitives/FormFields';
import { emptyValidator } from '../../utility/validation';

const reviseDebtFormValidation = {
	balance: [ emptyValidator ],
	paymentDay: [ emptyValidator ],
	minimumPayment: [ emptyValidator ],
	interestRate: [ emptyValidator ],
	interestCompounding: [ emptyValidator ]
};

const ReviseDebtForm = ({ debtId, debts, handleClose, createDebtRevision }) => {
	const initialValues = {
		effectiveDate: moment(),
		balance: '',
		paymentDay: debts[debtId].paymentDay,
		minimumPayment: debts[debtId].minimumPayment,
		interestRate: debts[debtId].interestRate,
		interestCompounding: debts[debtId].interestCompounding
	};
	const onSubmit = (values, { setSubmitting }) => {
		values.debtId = debtId;
		values.effectiveDate = values.effectiveDate.format('YYYY-MM-DD');

		createDebtRevision(values);

		setSubmitting(false);
		handleClose();
	};

	return (
		<div className="revise-debt-form">
			<Formik
				initialValues={initialValues}
				validate={validateReviseDebtForm}
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
							<DateField
								id="effectiveDate"
								label="Effective date"
								helpText="On what day should this revision take effect?"
								error={errors.effectiveDate}
								isTouched={touched.effectiveDate}
								initialDate={moment()}
								setFieldValue={setFieldValue}
								setFieldTouched={setFieldTouched}
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
									label: 'Balance'
								}}
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
								<button className="button is-text" type="button" onClick={handleClose}>
									Cancel
								</button>
								<button className="button is-primary" type="submit" disabled={isSubmitting}>
									Revise
								</button>
							</div>
						</form>
					);
				} }
			</Formik>
		</div>
	);
};

const validateReviseDebtForm = (values) => {
	const errors = Object.entries(reviseDebtFormValidation).reduce((accumulator, [field, validators]) => {
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
		createDebtRevision: (debt) => dispatch(createDebtRevision(debt))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviseDebtForm);
