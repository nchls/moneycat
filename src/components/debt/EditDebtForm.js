import React from 'react';
import { connect } from 'react-redux';
import { Formik, Field } from 'formik';
import moment from 'moment';

import { DEBT_TYPES, COMPOUNDING_TYPES, editDebt, deleteDebt } from './debtModule';
import { setPlanPayoffOrder } from '../planPage/planPageModule';
import { InputField, SelectField, DateField } from '../../primitives/FormFields';
import { emptyValidator } from '../../utility/validation';

const editDebtFormValidation = {
	name: [ emptyValidator ],
	type: [ emptyValidator ],
	startDate: [ emptyValidator ]
};

const EditDebtForm = ({
	debtId,
	debts,
	handleClose,
	editDebt,
	deleteDebt,
	planPayoffOrder,
	setPlanPayoffOrder,
	isPreparingToDelete,
	prepareToDelete,
	cancelDelete
}) => {

	const initialValues = {
		name: debts[debtId].name,
		type: debts[debtId].type,
		startDate: moment(debts[debtId].startDate, 'YYYY-MM-DD')
	};
	const onSubmit = (values, { setSubmitting }) => {
		values.id = debtId;
		values.startDate = values.startDate.format('YYYY-MM-DD');

		editDebt(values);

		setSubmitting(false);
		handleClose();
	};

	const doDelete = () => {
		let newPlanPayoffOrder = planPayoffOrder.slice();
		newPlanPayoffOrder.splice(newPlanPayoffOrder.indexOf(debtId), 1);
		setPlanPayoffOrder(newPlanPayoffOrder);

		deleteDebt(debtId);

		cancelDelete();
	}

	return (
		<div className="edit-debt-form">
			{ !isPreparingToDelete ? (
				<Formik
					initialValues={initialValues}
					validate={validateEditDebtForm}
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
									initialDate={moment(debts[debtId].startDate, 'YYYY-MM-DD')}
									setFieldValue={setFieldValue}
									setFieldTouched={setFieldTouched}
								/>
								<div className="buttons is-right">
									<button className="button is-text" type="button" onClick={handleClose}>
										Cancel
									</button>
									<button className="button is-danger" type="button" onClick={prepareToDelete}>
										Delete
									</button>
									<button className="button is-primary" type="submit" disabled={isSubmitting}>
										Save
									</button>
								</div>
							</form>
						);
					} }
				</Formik>
			) : (
				<div className="delete-dialog">
					<p>Are you sure you want to delete this debt? This cannot be undone.</p>
					<div className="buttons is-right">
						<button className="button is-text" type="button" onClick={cancelDelete}>
							Cancel
						</button>
						<button className="button is-danger" type="button" onClick={doDelete}>
							Delete this debt
						</button>
					</div>
				</div>
			) }
		</div>
	);
};

const validateEditDebtForm = (values) => {
	const errors = Object.entries(editDebtFormValidation).reduce((accumulator, [field, validators]) => {
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
		editDebt: (debt) => dispatch(editDebt(debt)),
		deleteDebt: (debtId) => dispatch(deleteDebt(debtId)),
		setPlanPayoffOrder: (payoffOrder) => dispatch(setPlanPayoffOrder(payoffOrder))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDebtForm);
