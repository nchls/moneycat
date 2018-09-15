import React from 'react';
import { Formik } from 'formik';

import { DEBT_TYPES, COMPOUNDING_TYPES } from './debtModule';
import { InputField, SelectField, DateField } from '../../primitives/FormFields';

const CreateDebtForm = () => {
	const initialValues = {};
	const onSubmit = (values, { setSubmitting }) => {
		setTimeout(() => {
			alert(JSON.stringify(values, null, 2));
			setSubmitting(false);
		}, 400);
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
					isSubmitting
				}) => (
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
							onChange={handleChange}
							onBlur={handleBlur}
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
				)}
			</Formik>
		</div>
	);
};

const validateCreateDebtForm = (values) => {
	console.log('validate', values);
	let errors = {};
	if (!values.email) {
		errors.email = 'Required';
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
		errors.email = 'Invalid email address';
	}
	return errors;
};

export default CreateDebtForm;
