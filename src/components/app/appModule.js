import { combineReducers } from 'redux';


export const initialState = {
	currencyCode: 'USD',
	isProcessing: false,
	lastSave: undefined,
	debts: {},
	debtRevisions: [],
	manualPayments: {},
	plan: {},
	planRevisions: [],
	payoffDates: {},
	ledger: {}
};

export const appReducer = (state, action) => {
	switch (action.type) {
		case 'CREATE_DEBT':
			const newState = {...state};
			newState.debts[action.debt.id] = action.debt;

		default:
			return state;
	}
};
