const initialState = {
	isProcessing: false,
	payoffDates: {},
	ledger: {}
};

export const projectionReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case 'SET_PROJECTION_PROCESSING':
            newState = { ...state, isProcessing: action.isProcessing };
            return newState;

        case 'UPDATE_PAYOFF_DATES':
            newState = { ...state, payoffDates: action.payoffDates };
            return newState;

        case 'UPDATE_LEDGER':
            newState = { ...state, ledger: action.ledger };
            return newState;

        default:
            return state;
    }
};

export const setProjectionProcessing = (isProcessing) => {
	return {
		type: 'SET_PROJECTION_PROCESSING',
		isProcessing: isProcessing
	};
};

export const updatePayoffDates = (payoffDates) => {
	return {
		type: 'UPDATE_PAYOFF_DATES',
		payoffDates: payoffDates
	};
};

export const updateLedger = (ledger) => {
	return {
		type: 'UPDATE_LEDGER',
		ledger: ledger
	};
};
