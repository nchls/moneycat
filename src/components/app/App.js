import React from 'react';

class AppContainer extends React.Component {
	render() {
		return <App {...this.props}/>;
	}
};

const App = () => {
	return (
		<div className="app">
			MONEY CAT!
		</div>
	);
};

export default AppContainer;
