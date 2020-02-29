import React, { Component } from "react";
import TransferForm from "./TransferForm";

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
                <div className="col-sm-1">
                </div>
                <div className="col-sm-2">
                    <button
                        className="btn btn-primary" 
                        data-target="#transferModal"
                        data-toggle="modal"                                             
                        type="button" 
                    >Transferir
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
            <p id="transferResult"></p> 
        </div>);
    }
}