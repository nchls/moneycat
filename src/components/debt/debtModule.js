export const DEBT_TYPES = [
	{
		slug: 'student-loan',
		name: 'Student loan'
	},
	{
		slug: 'auto-loan',
		name: 'Auto loan'
	},
	{
		slug: 'other-loan',
		name: 'Other loan'
	},
	{
		slug: 'mortgage',
		name: 'Mortgage'
	},
	{
		slug: 'credit-card',
		name: 'Credit card'
	}
];

export const COMPOUNDING_TYPES = [
	{
		slug: 'monthly',
		name: 'Monthly'
	},
	{
		slug: 'simple',
		name: 'Simple'
	}
];

export const getNewDebtId = (debts) => {
	const debtIds = Object.keys(debts);
	if (debtIds.length) {
		return Math.max(...Object.keys(debts).map((id) => parseInt(id))) + 1;
	}
	return 0;
};

const initialState = {};
export const debtReducer = (state = initialState, action) => {
	let newState;
	switch (action.type) {
		case 'CREATE_DEBT':
			newState = {
				...state,
				[action.debt.id]: {...action.debt}
			};
			return newState;

		case 'EDIT_DEBT':
			newState = {
				...state,
				[action.debt.id]: {...state[action.debt.id], ...action.debt}
			};
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

export const editDebt = (debt) => {
	return {
		type: 'EDIT_DEBT',
		debt: debt
	};
};

