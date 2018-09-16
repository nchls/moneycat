import React from 'react';
import { connect } from 'react-redux';


const ProjectedField = ({ data, isProcessing }) => {
	if (isProcessing) {
		return <span className="field-processing">Calculating...</span>;
	}
	return <span>{ data }</span>;
}

const mapStateToProps = (state) => {
	return {
		isProcessing: state.projection.isProcessing
	};
};

export default connect(mapStateToProps)(ProjectedField);
