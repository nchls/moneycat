import { createLogic } from 'redux-logic';

import {
	setProjectionProcessing,
	updateLedger,
	updateSquishedLedger,
	updatePayoffDates,
	updatePaymentTotal,
	updateMinimumPayoffDate,
	updateMinimumPaymentTotal
} from './projectionModule';


const workerPrefix = document.location.hostname.includes('github.io') ? '/reactriot2018-moneycat/dist' : '';
const worker = new Worker(`${workerPrefix}/worker.js`);
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
	'CREATE_DEBT_REVISION',
	'EDIT_DEBT',
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
                dispatch(updateSquishedLedger(output.squishedLedger));
				dispatch(updatePaymentTotal(output.paymentTotal));
				dispatch(setProjectionProcessing(false));
				done();
			});
		}
	}
});

const ACTIONS_TRIGGERING_MINIMUM_PROJECTION = [
	'STARTUP',
	'CREATE_DEBT',
	'EDIT_DEBT',
	'REVISE_DEBT',
	'SET_PLAN_EXTRA_AMOUNT',
	'SET_PLAN_PAYOFF_ORDER'
]

const minimumProjectionLogic = createLogic({
	type: ACTIONS_TRIGGERING_MINIMUM_PROJECTION,
	latest: true,
	process({ getState, action }, dispatch, done) {
		const state = getState();

		if (Object.keys(state.debts).length > 0) {
			const task = {
				taskName: 'GENERATE_MINIMUM_PROJECTION',
				data: {
					debts: state.debts,
					debtRevisions: [],
					manualPayments: {},
					plan: {...state.plan, extraAmount: 0},
					planRevisions: []
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
				dispatch(updateMinimumPayoffDate(output.minimumPayoffDate));
				dispatch(updateMinimumPaymentTotal(output.minimumPaymentTotal));
				dispatch(setProjectionProcessing(false));
				done();
			});
		}
	}
});

export default [ projectionLogic, minimumProjectionLogic ];
