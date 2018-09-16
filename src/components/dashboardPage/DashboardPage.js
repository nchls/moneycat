import React, { Fragment } from 'react';
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
				if (debtEntry.payment !== '0.00' && debtEntry.payment !== undefined) {
					accumulator.push({
						ymd: ymd,
						isPast: ymd <= today.format('YYYY-MM-DD'),
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

	const payoffDates = Object.entries(projection.payoffDates).map(([debtId, ymd]) => {
		const debt = Object.values(debts).find((debt) => debt.id === parseInt(debtId));
		return {
			ymd: ymd,
			debtName: debt.name
		};
	});
	payoffDates.sort((a, b) => {
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
							<div className="dashboard-payments">
								{ payments.length > 0 && (
									<Fragment>
										<h3 className="title is-5">Payments</h3>
										<h4 className="subtitle is-6">Recent and upcoming</h4>

										<ol>
											{ payments.map((payment) => {
												const debt = Object.values(debts).find((debt) => debt.id === payment.debtId);
												const dateString = moment(payment.ymd, 'YYYY-MM-DD').format('MMM D');
												return (
													<li key={ payment.ymd + debt.name }>
														{ payment.isPast ? '✔️' : '⬜' } { dateString }: { payment.isPast ? 'Paid' : 'Pay' } ${ payment.payment } to { debt.name }
													</li>
												);
											}) }
										</ol>
									</Fragment>
								) }

								<h3 className="title is-5">Projected payoff dates</h3>
								<ul>
									{ payoffDates.map(({ ymd, debtName }) => {
										const dateString = moment(ymd, 'YYYY-MM-DD').format('MMMM Do, YYYY');
										return (
											<li key={ debtName }>
												{ debtName }: { dateString }
											</li>
										);
									}) }
								</ul>
							</div>
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
