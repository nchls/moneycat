export const emptyValidator = (input, errorMessage='This field cannot be empty.') => {
	if (input === undefined || String(input).replace(/ /g, '') === '') {
		return errorMessage;
	}
	return;
};
