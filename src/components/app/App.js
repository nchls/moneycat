import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import './app.scss';

import { appReducer } from './appModule';
import Header from '../header/Header';
import DashboardPage from '../dashboardPage/DashboardPage';
import DebtsPage from '../debtsPage/DebtsPage';
import PlanPage from '../planPage/PlanPage';


export const urlRoot = '/reactriot2018-moneycat';

const MONEYCAT_VAULT_KEY = 'moneycat-vault';

// Middleware for putting the redux store into local storage.
// pass an array of actions to listen for, or don't and just store on every action
const createLocalStorageMiddleware = storeActions => store => next => action => {
    let result = next(action);
    if (window.localStorage) {
        if ((storeActions && storeActions.find(action.type)) || !storeActions) {
            try {
                // Maybe this could fail for some reason, I don't know
                window.localStorage.setItem(MONEYCAT_VAULT_KEY, JSON.stringify(store.getState()));
            } catch (e) { }
        }
    }
    return result;
}

const getStoreFromLocalStorage = () => {
    const preloadedState = window.localStorage ? window.localStorage.getItem(MONEYCAT_VAULT_KEY) : null;
    if (preloadedState) {
        try {
            return JSON.parse(preloadedState);
        } catch (e) { }
    }
    return null;
};

const middlewares = [createLocalStorageMiddleware()];

const composeEnhancers =
    typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancers = composeEnhancers(
    applyMiddleware(...middlewares)
);

const storedStore = getStoreFromLocalStorage();

const storeArgs = storedStore
    ? [appReducer, storedStore, enhancers]
    : [appReducer, enhancers];

const store = createStore(...storeArgs);

class AppContainer extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Router baseName={urlRoot}>
                    <App {...this.props} />
                </Router>
            </Provider>
        );
    }
};

const App = () => {
    return (
        <section class="section">
            <div class="container">
                <div className="app">
                    <Header />
                    <Route exact path="/" render={() => (
                        <Redirect to={`${urlRoot}/`} />
                    )} />
                    <Route exact path={`${urlRoot}/`} component={DashboardPage} />
                    <Route path={`${urlRoot}/debts`} component={DebtsPage} />
                    <Route path={`${urlRoot}/plan`} component={PlanPage} />

                </div>
            </div>
        </section>
    );
};

export default AppContainer;
