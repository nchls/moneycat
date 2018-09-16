import React from 'react';
import { connect } from 'react-redux';

import { resetAllData } from '../app/appModule';

const ResetModal = ({ reset, closeModal }) => (
    <div className="modal is-active">
    <div className="modal-background"></div>
    <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title">Erase data</p>
        <button onClick={closeModal} className="delete" aria-label="close"></button>
      </header>
      <section className="modal-card-body">
        Would you like to erase your data from the moneycat vault?
      </section>
      <footer className="modal-card-foot">
        <button onClick={() => {reset(); closeModal();}} className="button is-danger">Erase my data</button>
        <button onClick={closeModal} className="button">Cancel</button>
      </footer>
    </div>
  </div>
);

const mapDispatchToProps = {
    reset: resetAllData
};

const ConnectedResetModal = connect(null, mapDispatchToProps)(ResetModal);

class Reset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    openModal(){
        this.setState({modalOpen: true});
    }
    closeModal(){
        this.setState({modalOpen: false});
    }
    render() {
        return (
            <React.Fragment>
                <div className="header-reset-button">
                    <button className="button" onClick={this.openModal}>Reset</button>
                </div>
                {this.state.modalOpen && <ConnectedResetModal closeModal={this.closeModal} />}
            </React.Fragment>
        );
    }
};

export default Reset;
