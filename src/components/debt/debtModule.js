const initialState = {};

export const debtReducer = (state = initialState, action) => {
	let newState;
	switch (action.type) {
		case 'CREATE_DEBT':
			newState = {...state, [action.debt.id]: action.debt};
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
