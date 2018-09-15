import React from 'react';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

const FormField = ({ id, label, helpText, error, isTouched, children }) => {
	return (
		<div className="field">
			<label className="label" htmlFor={id}>{ label }</label>
			<div className="control">
				{ children }
				{ helpText && <div className="help">{ helpText }</div> }
				{ error && isTouched && <div className="help is-danger">{ error }</div> }
			</div>
		</div>
	);
}

export const InputField = (props) => {
	const { id, type, label, min, max, step, value, helpText, error, onChange, onBlur } = props;
	return (
		<FormField {...props}>
			<input
				className="input"
				onChange={onChange}
				onBlur={onBlur}
				id={id}
				type={type}
				value={value}
				min={min}
				max={max}
				step={step}
			/>
		</FormField>
	);
};

export const SelectField = (props) => {
	const { id, choices, label, helpText, error, onChange, onBlur } = props;
	choices[0].selected = true;
	return (
		<FormField {...props}>
			<div className="select">
				<select
					id={id}
					onChange={onChange}
					onBlur={onBlur}
				>
					{ choices.map((choice) => {
						return <option key={choice.slug} value={choice.slug}>{ choice.name }</option>;
					} ) }
				</select>
			</div>
		</FormField>
	);
};

export class DateField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			focused: props.autoFocus,
			date: props.initialDate
		};

		this.onDateChange = this.onDateChange.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
	}

	onDateChange(date) {
		this.setState({ date });
		this.props.setFieldValue(this.props.id, date); // Formik's callback
	}

	onFocusChange({ focused }) {
		this.setState({ focused });
		this.props.setFieldTouched(this.props.id, true); // Formik's callback
	}

	render() {
		const { focused, date } = this.state;

		const datepickerProps = {...this.props};
		[
			'autoFocus',
			'initialDate',
			'label',
			'helpText',
			'error',
			'isTouched',
			'setFieldValue',
			'setFieldTouched',
			'onBlur'
		].forEach((prop) => { delete datepickerProps[prop]; });

		return (
			<FormField {...this.props}>
				<SingleDatePicker
					{...datepickerProps}
					numberOfMonths={1}
					date={date}
					isOutsideRange={() => false}
					focused={focused}
					onDateChange={this.onDateChange}
					onFocusChange={this.onFocusChange}
				/>
			</FormField>
		);
	}
}
