import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './app.scss';

import { initialState, appReducer } from './appModule';
import Header from '../header/Header';
import DashboardPage from '../dashboardPage/DashboardPage';
import DebtsPage from '../debtsPage/DebtsPage';
import PlanPage from '../planPage/PlanPage';


const store = createStore(
	appReducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

class AppContainer extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<Router>
					<App {...this.props}/>
				</Router>
			</Provider>
		);
	}
};

const App = () => {
	return (
		<div className="app">
			<Header />
			<Route exact path="/" component={DashboardPage} />
			<Route path="/debts" component={DebtsPage} />
			<Route path="/plan" component={PlanPage} />
		</div>
	);
};

export default AppContainer;
