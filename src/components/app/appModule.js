import { combineReducers } from 'redux';

import { debtReducer } from '../debt/debtModule';
import { planReducer } from '../planPage/planPageModule';

export const appReducer = combineReducers({
    debts: debtReducer,
    plan: planReducer
});
