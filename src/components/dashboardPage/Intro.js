import React from 'react';
import { connect } from 'react-redux';
import { populateWithSampleData } from '../app/appModule';

const Intro = ({ getStarted }) => (
    <div>
        <h2 className="title is-4">Welcome to moneycat!</h2>
        <div>
            <p>Moneycat takes the stress out of managing your debt. Here's how it works:</p>
            <p>Step 1: First, add all your debts in the 'Debt' pane.</p>
            <p>Step 2: Once everything's been added, move over to the 'Plan' pane. Here you will be guided through the steps to craft a debt payment plan personalized just for you.</p>
            <p>Step 3: There is no step 3! You're done! Now you can move back to the dashboard, and see how you're doing.</p>
        </div>
        <div>If you'de like to get a tast of how moneycat works, click here to start working with some sample data.</div>
        <button className="button" onClick={getStarted}>
            Get started with some sample data.
        </button>
    </div>
)

const mapDispatchToProps = {
    getStarted: populateWithSampleData
};

export default connect(null, mapDispatchToProps)(Intro);
