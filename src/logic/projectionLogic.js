import { createLogic } from 'redux-logic';

const ACTIONS_TRIGGERING_PROJECTION = [
	'@@INIT',
	'CREATE_DEBT',
	'CREATE_DEBT_REVISION',
	'CREATE_MANUAL_PAYMENT',
	'SET_PLAN_EXTRA_AMOUNT',
	'SET_PLAN_PAYOFF_ORDER',
]

export default const projectionLogic = createLogic({
	type: ACTIONS_TRIGGERING_PROJECTION
});
