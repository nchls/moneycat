import React from 'react';
import BarChart from './BarChart';
import Spinner from '../../primitives/Spinner';

import './dashboardPage.scss';

const data = {
	'2018-05-15': {
		'DEBT1': {
			principalBalance: 50000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		},
		'DEBT2': {
			principalBalance: 5000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		},
		'DEBT3': {
			principalBalance: 5000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		},
	},
	'2018-06-15': {
		'DEBT1': {
			principalBalance: 40000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		},
		'DEBT2': {
			principalBalance: 4000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		}
	},
	'2018-07-15': {
		'DEBT1': {
			principalBalance: 30000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		},
		'DEBT2': {
			principalBalance: 3000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		}
	},
	'2018-08-15': {
		'DEBT1': {
			principalBalance: 20000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		},
		'DEBT2': {
			principalBalance: 2000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		}
	},
	'2018-09-15': {
		'DEBT1': {
			principalBalance: 10000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		},
		'DEBT2': {
			principalBalance: 1000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		}
	},
	'2018-10-15': {
		'DEBT1': {
			principalBalance: 1000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		},
		'DEBT2': {
			principalBalance: 100,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		}
	},
	'2018-11-15': {
		'DEBT4': {
			principalBalance: 1000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		},
	},
	'2018-12-15': {
		'DEBT4': {
			principalBalance: 2000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		},
	},
	'2019-01-15': {
		'DEBT4': {
			principalBalance: 3000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		},
	},
	'2019-02-15': {
		'DEBT4': {
			principalBalance: 4000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		},
	},
	'2019-03-15': {
		'DEBT4': {
			principalBalance: 5000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		},
	},
	'2019-04-15': {
		'DEBT4': {
			principalBalance: 6000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		},
	},
	'2019-04-16': {
		'DEBT4': {
			principalBalance: 6000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		},
	},
	'2019-04-17': {
		'DEBT4': {
			principalBalance: 6000,
			accruedInterest: 2,
			payment: 5,
			isManual: true
		},
	}
};

const DashboardPage = props => {
	// TODO: Pull data from redux store
	// TODO: This is bonkers. Definitely going over this data more than necessary.
	const allDebts = {};
	const dataObj = {};
	Object.keys(data).sort().map(t => {
		// This code is shitty. The overall idea is to transform and squash the ledger by
		// turning it into an array of objects, grouped (and indexed) by month, containing all of
		// the debt balances for that month. It also gathers all of the debt ids in the ledger.
		// All of this to get it onto a state to send to the chart
		const debts = {};
		Object.keys(data[t]).forEach(d => allDebts[d] = true);
		Object.keys(data[t]).forEach(d => debts[d] = data[t][d].principalBalance);
		const dateParts = t.match(/(\d{4})-(\d{2})-(\d{2})/);
		const time = `${dateParts[1]}-${dateParts[2]}`;
		if (!(time in dataObj)) {
			dataObj[time] = {};
		}
		for (const debt in debts) {
			if (debt in dataObj[time]) {
				dataObj[time][debt] += debts[debt];
			} else {
				dataObj[time][debt] = debts[debt];
			}
		}
	});
	const dataArray = Object.keys(dataObj).sort().map(t => ({
		time: t,
		...dataObj[t]
	}));

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
					data={dataArray}
					keys={Object.keys(allDebts)}
					width={800}
					height={400}
				/>
			</div >
		</Spinner>
	);
}

export default DashboardPage;
