import React from 'react';
import { Link } from 'react-router-dom';

import './header.scss';

const Header = () => {
	return (
		<header className="header">
			<div className="header-logo">
				<Link to="/" className="moneycat-logo">
					<h1>Moneycat</h1>
				</Link>
			</div>
			<nav className="nav">
				<ul className="nav-items">
					<li>
						<Link to="/">
							Dashboard
						</Link>
					</li>
					<li>
						<Link to="/debts">
							Debts
						</Link>
					</li>
					<li>
						<Link to="/plan">
							Plan
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
