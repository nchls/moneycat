export const emptyValidator = (input, extras, errorMessage='This field cannot be empty.') => {
	if (input === undefined || String(input).replace(/ /g, '') === '') {
		return errorMessage;
	}
	return;
};


export const debtNameValidator = (input, extras, errorMessage='A debt with that name already exists. Please choose a unique name for this debt.') => {
    const existingDebts = extras.existingDebts || {};
    for (const existingDebt in existingDebts) {
        if ((input || '').toLowerCase() === (existingDebts[existingDebt].name || '').toLowerCase()) {
            return errorMessage;
        }
    }
	return;
};
