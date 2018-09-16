import React from 'react';
import { Field } from 'formik';

import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';


const FormField = ({ name, label, helpText, error, isTouched, children }) => {
	return (
		<div className="field">
			{ label && <label className="label" htmlFor={`field-${name}`}>{ label }</label> }
			<div className="control">
				{ children }
				{ helpText && <div className="help">{ helpText }</div> }
				{ error && isTouched && <div className="help is-danger">{ error }</div> }
			</div>
		</div>
	);
}

export const InputField = ({
	field,
	form: { touched, errors },
	wrapperProps,
	fieldProps
}) => {
	return (
		<FormField {...wrapperProps} name={field.name} isTouched={touched[field.name]} error={errors[field.name]}>
			<input className="input" id={`field-${field.name}`} {...field} {...fieldProps}/>
		</FormField>
	);
};

export const SelectField = ({
	field,
	form: { touched, errors },
	choices,
	wrapperProps,
	fieldProps
}) => {
	return (
		<FormField {...wrapperProps} name={field.name} isTouched={touched[field.name]} error={errors[field.name]}>
			<div className="select">
				<select id={`field-${field.name}`} {...field} {...fieldProps}>
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

const DragHandle = SortableHandle(() => <span className="drag-handle">::</span>);

const SortableItem = SortableElement(({ value }) =>
	<li className="order-item">
		<DragHandle />
		{value}
	</li>
);

const SortableList = SortableContainer(({ items }) => {
	return (
		<ul className="payoff-order-list">
			{items.map((value, index) => (
				<SortableItem key={`item-${index}`} index={index} value={value} />
			))}
		</ul>
	);
});

export class OrderField extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: props.items
		};
		this.props.setFieldValue(props.id, props.items); // Formik's callback

		this.onSortEnd = this.onSortEnd.bind(this);
	}

	onSortEnd({ oldIndex, newIndex }) {
		this.setState({
			items: arrayMove(this.state.items, oldIndex, newIndex)
		});
		this.props.setFieldValue(this.props.id, this.state.items); // Formik's callback
	};

	render() {
		return (
			<FormField name={this.props.id} {...this.props}>
				<input
					className="input"
					type="hidden"
					onChange={this.props.onChange}
					onBlur={this.props.onBlur}
					id={this.props.id}
					name={`field-${this.props.id}`}
					value={this.state.items.join(',')}
				/>
				<SortableList items={this.state.items} onSortEnd={this.onSortEnd} />
			</FormField>
		);
	}
}
