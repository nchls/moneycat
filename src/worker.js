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
		postMessage({
			id: id,
			output: {
				ledger: ledger,
				payoffDates: payoffDates
			}
		});
	}
};
