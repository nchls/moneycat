import React from 'react';
import BarChart from './BarChart';

const data = {
    '2018-09-15': {
        'DEBT1': {
            principalBalance: 50000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        },
        'DEBT2': {
            principalBalance: 5000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        }
    },
    '2018-10-15': {
        'DEBT1': {
            principalBalance: 40000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        },
        'DEBT2': {
            principalBalance: 4000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        }
    },
    '2018-11-15': {
        'DEBT1': {
            principalBalance: 30000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        },
        'DEBT2': {
            principalBalance: 3000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        }
    },
    '2018-12-15': {
        'DEBT1': {
            principalBalance: 20000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        },
        'DEBT2': {
            principalBalance: 2000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        }
    },
    '2019-01-15': {
        'DEBT1': {
            principalBalance: 10000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        },
        'DEBT2': {
            principalBalance: 1000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        }
    },
    '2019-02-15': {
        'DEBT1': {
            principalBalance: 0,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        },
        'DEBT2': {
            principalBalance: 0,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        }
    }
};

const DashboardPage = props => {
    // TODO: Pull data from redux store
    const debts = {};
    const dataArray = Object.keys(data).sort().map(t => {
        Object.keys(data[t]).forEach(d => debts[d] = data[t][d].principalBalance);
        return {
            time: t,
            ...debts
        };
    });
    // N.B. BarChart's parent component must have a height defined, else it won't render ಠ_ಠ
    return (
        <div className="dashboard" style={{height: "500px"}}>
            <h2>Dashboard</h2>
            <BarChart
                data={dataArray}
                keys={Object.keys(debts)}
                width={800}
                height={400}
            />
        </div >
    );
}

export default DashboardPage;
