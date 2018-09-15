import React from 'react';
import BarChart from './BarChart';
import Spinner from '../../primitives/Spinner'

const data = {
    '2018-05-15': {
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
        },
        'DEBT3': {
            principalBalance: 5000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        },
    },
    '2018-06-15': {
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
    '2018-07-15': {
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
    '2018-08-15': {
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
    '2018-09-15': {
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
    '2018-10-15': {
        'DEBT1': {
            principalBalance: 1000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        },
        'DEBT2': {
            principalBalance: 100,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        }
    },
    '2018-11-15': {
        'DEBT4': {
            principalBalance: 1000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        },
    },
    '2018-12-15': {
        'DEBT4': {
            principalBalance: 2000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        },
    },
    '2019-01-15': {
        'DEBT4': {
            principalBalance: 3000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        },
    },
    '2019-02-15': {
        'DEBT4': {
            principalBalance: 4000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        },
    },
    '2019-03-15': {
        'DEBT4': {
            principalBalance: 5000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        },
    },
    '2019-04-15': {
        'DEBT4': {
            principalBalance: 6000,
            accruedInterest: 2,
            payment: 5,
            isManual: true
        },
    }
};

const DashboardPage = props => {
    // TODO: Pull data from redux store
    const allDebts = {};
    const dataArray = Object.keys(data).sort().map(t => {
        const debts = {};
        Object.keys(data[t]).forEach(d => allDebts[d] = true);
        Object.keys(data[t]).forEach(d => debts[d] = data[t][d].principalBalance);
        const dateParts = t.match(/(\d{4})-(\d{2})-(\d{2})/);
        return {
            time: `${dateParts[1]}-${dateParts[2]}`,
            ...debts
        };
    });

    // N.B. BarChart's parent component must have a height defined, else it won't render ಠ_ಠ
    return (
        // The ticket said we need a spinner, so this is ready to go when everything gets wired up
        <Spinner isLoading={false}>
            <div className="dashboard" style={{ height: "500px" }}>
                <h2>Dashboard</h2>
                <BarChart
                    data={dataArray}
                    keys={Object.keys(allDebts)}
                    width={800}
                    height={400}
                />
            </div >
        </Spinner>
    );
}

export default DashboardPage;
