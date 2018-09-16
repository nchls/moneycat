import React from 'react';
import { Link } from 'react-router-dom';

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
						<Link to={`${urlRoot}/`}>
							Dashboard
						</Link>
					</li>
					<li>
						<Link to={`${urlRoot}/debts`}>
							Debts
						</Link>
					</li>
					<li>
						<Link to={`${urlRoot}/plan`}>
							Plan
						</Link>
					</li>
				</ul>
			</nav>
            <Reset />
        </header>
	);
};

export default Header;
