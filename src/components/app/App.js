import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './app.scss';

import Nav from '../nav/Nav';
import DashboardPage from '../dashboardPage/DashboardPage';
import DebtsPage from '../debtsPage/DebtsPage';
import PlanPage from '../planPage/PlanPage';

class AppContainer extends React.Component {
	render() {
		return <App {...this.props}/>;
	}
};

const App = () => {
	return (
		<Router>
			<div className="app">
				<Nav />
				<Route exact path="/" component={DashboardPage} />
				<Route path="/debts" component={DebtsPage} />
				<Route path="/plan" component={PlanPage} />
			</div>
		</Router>
	);
};

export default AppContainer;
