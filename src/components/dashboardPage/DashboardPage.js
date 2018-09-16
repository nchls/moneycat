import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import BarChart from './BarChart';
import Intro from './Intro';

import './dashboardPage.scss';

const DashboardPage = ({ squishedLedger, plan, projection, debts }) => {
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

	const showIntro = (!plan.created) && squishedLedger.length === 0;

	const today = moment();
	const paymentsWindowStart = today.clone().subtract(1, 'month').format('YYYY-MM-DD');
	const paymentsWindowEnd = today.clone().add(1, 'month').format('YYYY-MM-DD');
	const payments = Object.entries(projection.ledger).reduce((accumulator, [ymd, entry]) => {
		if (ymd >= paymentsWindowStart && ymd <= paymentsWindowEnd) {
			Object.entries(entry).forEach(([debtId, debtEntry]) => {
				if (debtEntry.payment !== '0.00') {
					accumulator.push({
						ymd: ymd,
						debtId: parseInt(debtId),
						...debtEntry
					});
				}
			});
		}
		return accumulator;
	}, []);
	payments.sort((a, b) => {
		if (a.ymd < b.ymd) {
			return -1;
		}
		return 1;
	});

	// N.B. BarChart's parent component must have a height defined, else it won't render ಠ_ಠ
	// N.B. Nivo sucks at making legends. It only looks at the first data item to make the legend...
	//      And even then, it doesn't consider items that are too small, so you can't just push all
	//      the debtIds into the first item (that aren't already there) with zero balances
	// N.B. This chart isn't really a time series. If you omit a month from the data passed in,
	//      the chart won't render that month at all
	return (
		<div className="dashboard-page">
			{
				showIntro
				? <Intro />
				: (
					<div>
						<h2 className="title is-4">Dashboard</h2>
						<div className="is-clearfix">
							<div className="dashboard-chart">
								<BarChart
									data={squishedLedger}
									keys={Object.keys(allDebts)}
									width={800}
									height={400}
								/>
							</div>
							{ payments.length > 0 && (
								<div className="dashboard-payments">
									<h3 className="title is-5">Payments</h3>
									<h4 className="subtitle is-6">Recent and upcoming</h4>

									<ol>
										{ payments.map((payment) => {
											const debt = Object.values(debts).find((debt) => debt.id === payment.debtId);
											return (
												<li key={ payment.ymd + debt.name }>
													{ payment.ymd }: Pay ${ payment.payment } to { debt.name }
												</li>
											);
										}) }
									</ol>
								</div>
							) }
						</div>
					</div>
				)
			}
		</div>
	);
}

const mapStateToProps = state => ({
	squishedLedger: state.projection.squishedLedger,
	plan: state.plan,
	projection: state.projection,
	debts: state.debts
});

export default connect(mapStateToProps)(DashboardPage);
