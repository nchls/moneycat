import "@babel/polyfill";

import { generateProjection } from './utility/projection';


onmessage = (evt) => {
	const data = evt.data;
	const id = data.id;
	const task = data.task;
	const taskName = task.taskName;
	const taskData = task.data;

	if (taskName === 'GENERATE_PROJECTION') {
		const { ledger, payoffDates } = generateProjection(taskData);

		const paymentTotal = Object.values(ledger).reduce((accumulator, dateEntry) => {
			accumulator += Object.values(dateEntry).reduce((accumulator, debtEntry) => {
				accumulator += parseFloat(debtEntry.payment || 0);
				return accumulator;
			}, 0);
			return accumulator;
		}, 0);

		postMessage({
			id: id,
			output: {
				ledger: ledger,
				payoffDates: payoffDates,
				paymentTotal: paymentTotal.toFixed(2)
			}
		});
	}

	if (taskName === 'GENERATE_MINIMUM_PROJECTION') {
		const { ledger, payoffDates } = generateProjection(taskData);

		const latestPayoffDate = Object.values(payoffDates).reduce((accumulator, date) => {
			if (date > accumulator) {
				accumulator = date;
			}
			return accumulator;
		}, '1980-01-01');

		const paymentTotal = Object.values(ledger).reduce((accumulator, dateEntry) => {
			accumulator += Object.values(dateEntry).reduce((accumulator, debtEntry) => {
				accumulator += parseFloat(debtEntry.payment || 0);
				return accumulator;
			}, 0);
			return accumulator;
		}, 0);

		postMessage({
			id: id,
			output: {
				minimumPayoffDate: latestPayoffDate,
				minimumPaymentTotal: paymentTotal.toFixed(2)
			}
		});
	}
};
