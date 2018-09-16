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

const initialState = {};
export const debtReducer = (state = initialState, action) => {
	let newState;
	switch (action.type) {
		case 'CREATE_DEBT':
			const newDebtId = (Object.keys(state).length ?
				(Math.max(...Object.keys(state).map((id) => parseInt(id)))) + 1
			:
				0
			);
			newState = {
				...state,
				[newDebtId]: {...action.debt, id: newDebtId}
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
