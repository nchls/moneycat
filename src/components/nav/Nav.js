import React from 'react';
import { Link } from 'react-router-dom';

import './nav.scss';

const Nav = () => {
	return (
		<div className="navbar">
			<div className="navbar-brand">
				<Link to="/" className="navbar-item">
					Moneycat
				</Link>
				<button className="navbar-burger"></button>
			</div>
			<div className="navbar-menu">
				<ul className="navbar-start">
					<li>
						<Link to="/" className="navbar-item">
							Dashboard
						</Link>
					</li>
					<li>
						<Link to="/debts" className="navbar-item">
							Debts
						</Link>
					</li>
					<li>
						<Link to="/plan" className="navbar-item">
							Plan
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Nav;
