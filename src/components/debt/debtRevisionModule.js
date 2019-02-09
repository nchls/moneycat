const initialState = [];
export const debtRevisionReducer = (state = initialState, action) => {
	let newState;
	switch (action.type) {
		case 'CREATE_DEBT_REVISION':
			newState = state.slice();
			const dupeRevisionIndex = state.findIndex((revision) => {
				return (revision.debtId === action.revision.debtId && revision.effectiveDate === action.revision.effectiveDate);
			});
			if (dupeRevisionIndex !== -1) {
				newState.splice(dupeRevisionIndex, 1, action.revision);
			} else {
				newState.push(action.revision);
			}
			return newState;

        case 'RESET_ALL_DATA':
            newState = {...initialState};
            return newState;

		default:
			return state;
	}
};

export const createDebtRevision = (revision) => {
	return {
		type: 'CREATE_DEBT_REVISION',
		revision: revision
	};
};
