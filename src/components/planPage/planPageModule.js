const sampleData = {
    created: "2018-09-16", 
    extraAmount: 900, 
    payoffOrder: [0, 2, 1]
};

const initialState = {
    created: undefined,
    extraAmount: undefined,
    payoffOrder: undefined
};

export const planReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case 'SET_PLAN_CREATED':
            newState = { ...state, created: action.created };
            return newState;

        case 'SET_PLAN_EXTRA_AMOUNT':
            newState = { ...state, extraAmount: action.amount };
            return newState;

        case 'SET_PLAN_PAYOFF_ORDER':
            newState = { ...state, payoffOrder: action.payoffOrder };
            return newState;

        case 'POPULATE_WITH_SAMPLE_DATA':
            newState = {...sampleData};
            return newState;

        case 'RESET_ALL_DATA':
            newState = {...initialState};
            return newState;
            
        default:
            return state;
    }
};

export const setPlanCreated = (created) => {
    return {
        type: 'SET_PLAN_CREATED',
        created: created
    };
};

export const setPlanExtraAmount = (amount) => {
    return {
        type: 'SET_PLAN_EXTRA_AMOUNT',
        amount: amount
    };
};

export const setPlanPayoffOrder = (payoffOrder) => {
    return {
        type: 'SET_PLAN_PAYOFF_ORDER',
        payoffOrder: payoffOrder
    };
};
