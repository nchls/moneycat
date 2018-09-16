import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import { urlRoot } from '../app/App';
import Reset from './Reset';
import './header.scss';

const Header = () => {
	return (
		<header className="header">
			<div className="header-logo">
				<Link to={`${urlRoot}/`} className="moneycat-logo">
					<h1>Moneycat</h1>
				</Link>
			</div>
			<nav className="nav">
				<ul className="nav-items">
					<li>
						<NavLink to={`${urlRoot}/`} exact activeClassName='is-active'>
							Dashboard
						</NavLink>
					</li>
					<li>
						<NavLink to={`${urlRoot}/debts`} activeClassName='is-active'>
							Debts
						</NavLink>
					</li>
					<li>
						<NavLink to={`${urlRoot}/plan`} activeClassName='is-active'>
							Plan
						</NavLink>
					</li>
				</ul>
			</nav>
            <Reset />
        </header>
	);
};

export default Header;
