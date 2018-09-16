import parseDate from 'date-fns/parse';
import format from 'date-fns/format';
import addDays from 'date-fns/add_days';
import getDate from 'date-fns/get_date';

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
	const ledger = {};
	const payoffDates = Object.keys(debts).reduce((accumulator, debtId) => {
		accumulator[debtId] = null;
		return accumulator;
	}, {});

	const debtsCount = Object.keys(debts).length;
	let debtsPaidOffCount = 0;

	const startYMD = getEarliestStartDate(Object.values(debts));

	// Initialize stateful variables
	let dt = parseDate(startYMD);
	let payoffOrder = plan.payoffOrder;
	let extraAmount = parseFloat(plan.extraAmount);
	let debtState = Object.values(debts).reduce((accumulator, debt) => {
		accumulator[debt.id] = {...debt, accruedInterest: 0};
		return accumulator;
	}, {});
	let isAvalancheDebt;
	let monthlyAvalanche = 0;
	let pocketChange = 0;

	while (debtsPaidOffCount < debtsCount) {
		const ymd = format(dt, 'YYYY-MM-DD');
		const dayOfMonth = getDate(dt);

		const planRevision = planRevisions.find((revision) => revision.effectiveDate === ymd);
		if (planRevision !== undefined) {
			payoffOrder = planRevision.payoffOrder;
			extraAmount = planRevision.extraAmount;
		}

		if (dayOfMonth === 1) {
			monthlyAvalanche = extraAmount;
			// Add the minimum payments of paid-off debts to the month's avalanche fund
			Object.values(debtState).forEach((debt) => {
				if (debt.balance === 0) {
					monthlyAvalanche += debt.minimumPayment;
				}
			});
		}

		const orderedDebts = payoffOrder.map((debtId) => debts[debtId]);

		isAvalancheDebt = true;
		ledger[ymd] = orderedDebts.reduce((accumulator, debt) => {
			accumulator[debt.id] = {
				principalBalance: undefined,
				accruedInterest: undefined,
				isManual: undefined,
				payment: undefined,
			};

			// Debt hasn't started yet or is paid off
			if (ymd < debtState[debt.id].startDate || debtState[debt.id].balance === 0) {
				accumulator[debt.id].principalBalance = 0;
				accumulator[debt.id].accruedInterest = 0;
				return accumulator;
			}

			const debtRevision = debtRevisions.find((revision) => {
				return (revision.debtId === debt.id && revision.effectiveDate === ymd);
			});
			if (debtRevision !== undefined) {
				debtState[debt.id].balance = debtRevision.balance;
				debtState[debt.id].paymentDay = parseInt(debtRevision.paymentDay);
				debtState[debt.id].minimumPayment = debtRevision.minimumPayment;
				debtState[debt.id].interestRate = debtRevision.interestRate;
			}

			const interest = debtState[debt.id].balance * ((debtState[debt.id].interestRate / 100) / 365.26);
			debtState[debt.id].accruedInterest += interest;

			if (dayOfMonth === 1 && debtState[debt.id].interestCompounding !== 'simple') {
				debtState[debt.id].balance += debtState[debt.id].accruedInterest;
				debtState[debt.id].accruedInterest = 0;
			}

			let paymentAmount;
			let paymentToThisDebt = 0;
			const manualPayment = Object.entries(manualPayments).find(([ymd, payment]) => {
				return (payment.debtId === debt.id && payment.effectiveDate === ymd);
			});
			if (manualPayment !== undefined) {
				paymentAmount = manualPayment[1].payment;
				accumulator[debt.id].isManual = true;
				paymentToThisDebt = paymentAmount;

				if (debtState[debt.id].accruedInterest < paymentAmount) {
					paymentAmount -= debtState[debt.id].accruedInterest;
					debtState[debt.id].accruedInterest = 0;
				} else {
					debtState[debt.id].accruedInterest -= paymentAmount;
					paymentAmount = 0;
				}
				if (debtState[debt.id].balance <= paymentAmount) {
					paymentAmount -= debtState[debt.id].balance;
					debtState[debt.id].balance = 0
					debtsPaidOffCount++;
					payoffDates[debt.id] = ymd;
				} else {
					debtState[debt.id].balance -= paymentAmount;
				}
			} else {
				accumulator[debt.id].isManual = false;
				if (debtState[debt.id].paymentDay === dayOfMonth) {
					paymentAmount = debtState[debt.id].minimumPayment;
					if (isAvalancheDebt) {
						paymentAmount += monthlyAvalanche;
						paymentAmount += pocketChange;
						pocketChange = 0;
						monthlyAvalanche = 0;
					}

					if (debtState[debt.id].accruedInterest < paymentAmount) {
						paymentToThisDebt += debtState[debt.id].accruedInterest;
						paymentAmount -= debtState[debt.id].accruedInterest;
						debtState[debt.id].accruedInterest = 0;
					} else {
						paymentToThisDebt += debtState[debt.id].accruedInterest;
						debtState[debt.id].accruedInterest -= paymentAmount;
						paymentAmount = 0;
					}

					if (debtState[debt.id].balance <= paymentAmount) {
						paymentToThisDebt += debtState[debt.id].balance;
						paymentAmount -= debtState[debt.id].balance;
						debtState[debt.id].balance = 0
						debtsPaidOffCount++;
						payoffDates[debt.id] = ymd;
						pocketChange = paymentAmount;
					} else {
						paymentToThisDebt += paymentAmount;
						debtState[debt.id].balance -= paymentAmount;
					}
				}
			}

			accumulator[debt.id].payment = paymentToThisDebt.toFixed(2);
			accumulator[debt.id].principalBalance = debtState[debt.id].balance.toFixed(2);
			accumulator[debt.id].accruedInterest = debtState[debt.id].accruedInterest.toFixed(2);

			isAvalancheDebt = false;

			return accumulator;
		}, {});

		dt = addDays(dt, 1);
	}

	return {
		ledger: ledger,
		payoffDates: payoffDates
	};
};

const getEarliestStartDate = (debts) => {
	return debts.reduce((accumulator, debt) => {
		if (debt.startDate < accumulator) {
			accumulator = debt.startDate;
		}
		return accumulator;
	}, '2199-12-31');
};
