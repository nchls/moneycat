import { combineReducers } from 'redux';

import { debtReducer } from '../debt/debtModule';
import { planReducer } from '../planPage/planPageModule';
import { projectionReducer } from '../../logic/projectionModule';

export const appReducer = combineReducers({
    debts: debtReducer,
    plan: planReducer,
    projection: projectionReducer
});

export const startup = () => {
    return {
        type: 'STARTUP'
    };
};
