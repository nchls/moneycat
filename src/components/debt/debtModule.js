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
		slug: 'mortgage',
		name: 'Mortgage'
	},
	{
		slug: 'credit-card',
		name: 'Credit card'
	},
	{
		slug: 'other-loan',
		name: 'Other loan'
	},
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

const sampleData = {
	"0": {
		"name": "Student Loan",
		"type": "student-loan",
		"balance": 50000,
		"startDate": "2017-07-01",
		"paymentDay": 15,
		"minimumPayment": 800,
		"interestRate": 5,
		"interestCompounding": "monthly",
		"id": 0
	},
	"1": {
		"name": "Car Payment",
		"type": "auto-loan",
		"balance": 20000,
		"startDate": "2017-07-01",
		"paymentDay": 28,
		"minimumPayment": 600,
		"interestRate": 7,
		"interestCompounding": "monthly",
		"id": 1
	},
	"2": {
		"name": "Mortgage",
		"type": "mortgage",
		"balance": 60000,
		"startDate": "2017-07-01",
		"paymentDay": 20,
		"minimumPayment": 1200,
		"interestRate": 20,
		"interestCompounding": "monthly",
		"id": 2
	}
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

		case 'DELETE_DEBT':
			newState = {...state};
			delete newState[action.debtId];
			return newState;

		case 'POPULATE_WITH_SAMPLE_DATA':
			newState = {...sampleData};
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

export const deleteDebt = (debtId) => {
	return {
		type: 'DELETE_DEBT',
		debtId: debtId
	};
}
