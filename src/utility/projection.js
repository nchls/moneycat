export const orderDebtsForPayoff = (debts) => {
	return Object.values(debts).sort((a, b) => {
		const intRateDiff = b.interestRate - a.interestRate;
		// If the interest rates are the same, go with the smaller balance
		if (intRateDiff === 0) {
			return a.balance - b.balance;
		}
		return intRateDiff;
	});
};

export const generateProjection = ({ debts, debtRevisions, manualPayments, plan, planRevisions }) => {
	return {
		ledger: {},
		payoffDates: {}
	};
};
