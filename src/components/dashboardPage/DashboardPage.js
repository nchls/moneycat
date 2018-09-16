import React from 'react';
import { connect } from 'react-redux';
import BarChart from './BarChart';
import Spinner from '../../primitives/Spinner';

import './dashboardPage.scss';

const DashboardPage = ({ squishedLedger }) => {
    const allDebts = {};
    if (squishedLedger) {
        squishedLedger.forEach(entry => {
            Object.keys(entry).forEach(debt => {
                if (debt !== '__time__') {
                    allDebts[debt] = true;
                }
            })
        })
    }
	
	// N.B. BarChart's parent component must have a height defined, else it won't render ಠ_ಠ
	// N.B. Nivo sucks at making legends. It only looks at the first data item to make the legend...
	//      And even then, it doesn't consider items that are too small, so you can't just push all
	//      the debtIds into the first item (that aren't already there) with zero balances
	// N.B. This chart isn't really a time series. If you omit a month from the data passed in,
	//      the chart won't render that month at all
	return (
		// The ticket said we need a spinner, so this is ready to go when everything gets wired up
		<Spinner isLoading={false}>
			<div className="dashboard-page" style={{ height: "500px" }}>
				<h2 className="title is-4">Dashboard</h2>
				<BarChart
					data={squishedLedger}
					keys={Object.keys(allDebts)}
					width={800}
					height={400}
				/>
			</div >
		</Spinner>
	);
}

const mapStateToProps = state => ({
    squishedLedger: state.projection.squishedLedger
});

export default connect(mapStateToProps)(DashboardPage);
