const initialState = {};

export const debtReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'CREATE_DEBT':
			const newState = {...state};
			newState[action.debt.id] = action.debt;
			return newState;

		default:
			return state;
	}
};

export const createDebt = (debt) => {
	return {
		type: 'CREATE_DEBT',
		debt: debt
	};
};
