import React from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';

import { DEBT_TYPES, COMPOUNDING_TYPES, createDebt } from './debtModule';
import { InputField, SelectField, DateField } from '../../primitives/FormFields';
import { emptyValidator } from '../../utility/validation';

const debtFormValidation = {
	name: [ emptyValidator ],
	type: [ emptyValidator ],
	balance: [ emptyValidator ],
	startDate: [ emptyValidator ],
	minimumPayment: [ emptyValidator ],
	interestRate: [ emptyValidator ],
	interestCompounding: [ emptyValidator ]
};

const CreateDebtForm = ({ createDebt }) => {
	const initialValues = {
		type: DEBT_TYPES[0],
		interestCompounding: COMPOUNDING_TYPES[0]
	};
	const onSubmit = (values, { setSubmitting }) => {
		values.type = values.type.slug;
		values.interestCompounding = values.interestCompounding.slug;
		values.startDate = values.startDate.format('YYYY-MM-DD');
		createDebt(values);
		setSubmitting(false);
	};

	return (
		<div className="create-debt-form">
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
							<InputField
								id="name"
								type="text"
								label="Name"
								helpText="Just for your own reference."
								error={errors.name}
								isTouched={touched.name}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							<SelectField
								id="type"
								choices={DEBT_TYPES}
								label="Type"
								error={errors.type}
								isTouched={touched.type}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							<InputField
								id="balance"
								type="number"
								min={1}
								max={99999999}
								label="Starting balance"
								error={errors.balance}
								isTouched={touched.balance}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							<DateField
								id="startDate"
								label="Start date"
								helpText={`
									To be specific, this is the date on which the debt begins to accrue interest.
									Or it can be any date on which you want to start tracking progress, so long as you set
									the starting balance to what it was on this date.
								`}
								error={errors.startDate}
								isTouched={touched.startDate}
								setFieldValue={setFieldValue}
								setFieldTouched={setFieldTouched}
							/>
							<InputField
								id="minimumPayment"
								type="number"
								min={1}
								max={99999}
								label="Minimum payment"
								error={errors.minimumPayment}
								isTouched={touched.minimumPayment}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							<InputField
								id="interestRate"
								type="number"
								min={0.01}
								max={100}
								step={0.01}
								label="Interest rate"
								error={errors.interestRate}
								isTouched={touched.interestRate}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							<SelectField
								id="interestCompounding"
								choices={COMPOUNDING_TYPES}
								label="Interest compounding"
								error={errors.interestCompounding}
								isTouched={touched.interestCompounding}
								helpText={`
									Most debts compound interest monthly. Exceptions include some student loans, where
									accrued interest is never added back to the principal.
								`}
								onChange={handleChange}
								onBlur={handleBlur}
							/>

							<button className="button is-primary" type="submit" disabled={isSubmitting}>
								Create
							</button>
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

	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		createDebt: (debt) => dispatch(createDebt(debt))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateDebtForm);
