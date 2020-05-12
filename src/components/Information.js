import React, { Component } from "react";
import {smartContractVersion, appVersion, networkName} from "../../services/GlobalVariables";

export class Information extends Component {

    constructor(props) {
        super(props);
    }

    // Devuelvo el estado de la conexión para el panel de la pantalla principal
    isConectedInfo() {        
        if (this.props.state.conected) {
            return <span className="badge badge-success">Conectado</span>;
        }

        return <span className="badge badge-danger">Desconectado</span>;
    }

    render () {
        return (<div>
                <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="card bg-light text-dark col-sm-10" id="accountData">
                        <div className="card-body">
                            <h5 className="card-title">Información de la cuenta</h5>
                            <hr />
                            <div className="card-text"><b>Cuenta:</b> {this.props.state.account}</div>
                            <div className="card-text"><b>Balance:</b> {this.props.state.accountBalance} eth</div>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="card bg-light text-dark col-sm-10" id="networkData">
                        <div className="card-body">
                            <h5 className="card-title">Información de la aplicación
                                <div className="float-right">{this.isConectedInfo()}</div>
                            </h5>    
                            <hr />    
                            <div className="card-text"><b>Versión de la aplicación:</b> {appVersion}</div>
                            <div className="card-text"><b>Versión del contrato:</b> {smartContractVersion}</div>                     
                            <div className="card-text"><b>Nombre de la red:</b> {networkName}</div>
                            <div className="card-text"><b>Dirección del contrato:</b> {this.props.state.contract}</div>
                            <div className="card-text"><b>Balance del contrato:</b> {this.props.state.contractBalance} eth</div>
                        </div>
                    </div> 
                </div>
            </div>
            );
    }
}