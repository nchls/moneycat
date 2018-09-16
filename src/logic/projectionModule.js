const initialState = {
	isProcessing: false,
	payoffDates: {},
    ledger: {},
    squishedLedger: [],
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
            
        case 'UPDATE_SQUISHED_LEDGER':
            newState = { ...state, squishedLedger: action.squishedLedger };
            return newState;

		case 'UPDATE_PAYMENT_TOTAL':
			newState = { ...state, paymentTotal: action.paymentTotal };
			return newState;

		case 'UPDATE_MINIMUM_PAYOFF_DATE':
			newState = { ...state, minimumPayoffDate: action.minimumPayoffDate };
			return newState;

		case 'UPDATE_MINIMUM_PAYMENT_TOTAL':
			newState = { ...state, minimumPaymentTotal: action.minimumPaymentTotal };
			return newState;

        case 'RESET_ALL_DATA':
            newState = { ...initialState };
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

export const updateSquishedLedger = (squishedLedger) => {
	return {
		type: 'UPDATE_SQUISHED_LEDGER',
		squishedLedger: squishedLedger
	};
};

export const updateMinimumPayoffDate = (minimumPayoffDate) => {
	return {
		type: 'UPDATE_MINIMUM_PAYOFF_DATE',
		minimumPayoffDate: minimumPayoffDate
	};
};

export const updateMinimumPaymentTotal = (minimumPaymentTotal) => {
	return {
		type: 'UPDATE_MINIMUM_PAYMENT_TOTAL',
		minimumPaymentTotal: minimumPaymentTotal
	};
};

export const updatePaymentTotal = (paymentTotal) => {
	return {
		type: 'UPDATE_PAYMENT_TOTAL',
		paymentTotal: paymentTotal
	};
};

