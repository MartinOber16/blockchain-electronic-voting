import React, { Component } from "react";
import TransferForm from "./TransferForm";
import TransferForm2 from "./TransferForm2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faDownload } from '@fortawesome/free-solid-svg-icons';

export class TransferList extends Component {

    constructor(props) {
        super(props);
    }

    render () {
        return (<div id="Transfers">
            <h4>Transferencias</h4>
            <hr />
            <div className="row">
                <div className="col-sm-4">
                    <b>Balance del contrato:</b> {this.props.state.contractBalance} ethers
                </div>                        
            </div>
            <br />
            <div className="row">
                <div className="col-sm-4">
                    <p>Transferir saldo a una cuenta</p>
                </div>
                <div className="col-sm-1">
                    <button
                        className="btn btn-primary" 
                        data-target="#transferModal"
                        data-toggle="modal"                                             
                        type="button" 
                    > <FontAwesomeIcon icon={faExchangeAlt} />
                    </button>
                </div>   
                <div className="col-sm-1"></div>                        
                <div className="col-sm-4">
                    <p>Transferir saldo al contrato</p>
                </div>
                <div className="col-sm-1">
                    <button
                        className="btn btn-primary" 
                        data-target="#transferModal2"
                        data-toggle="modal"                                             
                        type="button" 
                    > <FontAwesomeIcon icon={faDownload} />
                    </button>
                </div>                           
            </div>
            <br />
            <div className="modal" id="transferModal">
                <TransferForm 
                    account={this.props.state.account}
                    BEVService={this.props.BEVService} 
                    web3={this.props.web3}
                />
            </div>
            <div className="modal" id="transferModal2">
                <TransferForm2 
                    account={this.props.state.account}
                    BEVService={this.props.BEVService} 
                    web3={this.props.web3}
                />
            </div>
        </div>);
    }
}