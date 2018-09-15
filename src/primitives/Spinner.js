import React from 'react';

const Spinner = ({ isLoading, children }) => (
    isLoading
        ? (
            <div className="spinner-overlay">
                <div className="spinner">
                    {Array(12).fill(0).map(_ => <div />)}
                </div>
            </div>
        )
        : children
);

export default Spinner;
