import { combineReducers } from 'redux';

import { debtReducer } from '../debt/debtModule';


export const appReducer = combineReducers({
	debts: debtReducer
});
