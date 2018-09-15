const initialState = {
	created: undefined,
	extraAmount: undefined,
	payoffOrder: []
};

export const planReducer = (state = initialState, action) => {
	let newState;
	switch (action.type) {
		case 'SET_PLAN_CREATED':
			newState = {...state, created: action.created};
			return newState;

		case 'SET_PLAN_EXTRA_AMOUNT':
			newState = {...state, extraAmount: action.amount};
			return newState;

		case 'SET_PLAN_PAYOFF_ORDER':
			newState = {...state, payoffOrder: action.order};
			return newState;

		default:
			return state;
	}
};

export const setPlanCreated = (created) => {
	return {
		type: 'SET_PLAN_CREATED',
		created: created
	};
};

export const setPlanExtraAmount = (amount) => {
	return {
		type: 'SET_PLAN_EXTRA_AMOUNT',
		amount: amount
	};
};

export const setPlanPayoffOrder = (order) => {
	return {
		type: 'SET_PLAN_CREATED',
		created: order
	};
};