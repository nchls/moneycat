import React, { Fragment } from 'react';
import { connect } from 'react-redux';


class DebtContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isExpanded: false
		};
		this.toggleExpand = this.toggleExpand.bind(this);
	}

	toggleExpand() {
		this.setState({isExpanded: !this.state.isExpanded});
	}

	render() {
		return <Debt {...this.props} isExpanded={this.state.isExpanded} toggleExpand={this.toggleExpand} />;
	}
}

const Debt = (props) => {
	const {
		isExpanded,
		toggleExpand,
		debt: {
			id,
			name,
			type,
			balance,
			startDate,
			minimumPayment,
			interestRate,
			interestCompounding
		}
	} = props;
	return (
		<div className="card" onClick={ () => { !isExpanded && toggleExpand(); } }>
			<p>{ name }</p>
			{ isExpanded && (
				<Fragment>
					<p>Type: { type }</p>
					<p>Starting balance: { balance }</p>
					<p>Start date: { startDate }</p>
					<p>Minimum payment: { minimumPayment }</p>
					<p>Interest rate: { interestRate }</p>
					<p>Interest compounding: { interestCompounding }</p>
					<button className="button is-text" onClick={toggleExpand}>Collapse</button>
				</Fragment>
			) }
		</div>
	);
}

const DebtForm = () => {

};

export default DebtContainer;
