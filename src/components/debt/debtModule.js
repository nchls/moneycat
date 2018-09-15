export const createDebt = (debt) => {
	return {
		type: 'CREATE_DEBT',
		debt: debt
	};
};
