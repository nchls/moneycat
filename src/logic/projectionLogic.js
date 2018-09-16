import { createLogic } from 'redux-logic';

import { setProjectionProcessing, updateLedger, updatePayoffDates } from './projectionModule';


const worker = new Worker('/worker.js');
let workerTaskId = 0;
const workerTasks = {};

worker.onmessage = (evt) => {
	if (evt.data.id in workerTasks) {
		workerTasks[evt.data.id].resolve(evt.data.output);
	} else {
		console.warn(`Unknown message received with id ${evt.data.id}`);
	}
};

const ACTIONS_TRIGGERING_PROJECTION = [
	'STARTUP',
	'CREATE_DEBT',
	'REVISE_DEBT',
	'CREATE_MANUAL_PAYMENT',
	'SET_PLAN_EXTRA_AMOUNT',
	'SET_PLAN_PAYOFF_ORDER',
	'REVISE_PLAN_EXTRA_AMOUNT',
	'REVISE_PLAN_PAYOFF_ORDER'
]

const projectionLogic = createLogic({
	type: ACTIONS_TRIGGERING_PROJECTION,
	latest: true,
	process({ getState, action }, dispatch, done) {
		const state = getState();

		if (state.plan.extraAmount && state.plan.payoffOrder.length > 0) {
			const task = {
				taskName: 'GENERATE_PROJECTION',
				data: {
					// TODO: remove fallbacks
					debts: state.debts,
					debtRevisions: state.debtRevisions || [],
					manualPayments: state.manualPayments || {},
					plan: state.plan,
					planRevisions: state.planRevisions || []
				}
			};

			const taskPromise = new Promise((resolve, reject) => {
				workerTasks[workerTaskId] = {
					resolve: resolve,
					reject: reject
				};
			});
			worker.postMessage({id: workerTaskId, task: task});
			workerTaskId++;

			dispatch(setProjectionProcessing(true));
			taskPromise.then((output) => {
				dispatch(updatePayoffDates(output.payoffDates));
				dispatch(updateLedger(output.ledger));
				dispatch(setProjectionProcessing(false));
				done();
			});
		}
	}
});

export default [ projectionLogic ];
