export const orderDebtsForPayoff = (debts) => {
	return Object.values(debts).sort((a, b) => {
		return a.interestRate - b.interestRate;
	});
};
