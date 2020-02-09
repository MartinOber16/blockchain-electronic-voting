import React, { Component } from "react";
import VotingForm from "./VotingForm";

export class ElectionsByAccountList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            electionsByAccount: []
        };
    }

    // Obtengo todas las elecciones de una cuenta
    async getElectionsByAccount() {
        if(this.props.state.conected) {            
            let electionsByAccount = await this.props.BEVService.getElectionsByAccount(this.props.state.account);            
            this.setState({
                electionsByAccount: electionsByAccount
            });
        }
    }

    // Comprobante de voto
    async getTransaction (election) {
        if(this.props.state.conected) {            
            let transactionInfo = await this.props.BEVService.getTransaction(election, this.props.state.account);
            console.log("Transacción: " + transactionInfo);
            // return transactionInfo;
        }
    }

    // TODO: Mostrar resultados de la elección
    async getResultElection (election) {
        if(this.props.state.conected) {            
            let candidatoGanador = await this.props.BEVService.getResultElection(election);
            console.log(candidatoGanador[0]);        
            // return candidatoGanador;
        }
    }

    // Obtener todos los candidatos de una elección
    async getCandidatesByElection(election) {
        if(this.props.state.conected) {            
            let candidatesByElection = await this.props.BEVService.getCandidatesByElection(election);
            console.log(candidatesByElection);
            // return candidatesByElection;
        }
    }

    // TODO: renderTableDataElectionsByAccount -> Habilitar los botones segun si ya voto
    renderTableDataElectionsByAccount () {
        this.getElectionsByAccount();
        if(this.props.state.conected) {
            return this.state.electionsByAccount.map((election) => {
            const { id, name, active, yaVoto } = election
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{active}</td>
                    <td>{yaVoto}</td>
                    <td>
                        <button 
                            className="btn btn-primary" 
                            data-target="#electionByAccountModal"
                            data-toggle="modal"
                            type="button"                                                         
                            >Votar
                        </button>
                        <button 
                            className="btn btn-info"                                                    
                            onClick={async () => {await this.getTransaction(id);}} 
                            type="button"
                            >Comprobante
                        </button>
                        <button 
                            className="btn btn-info"                                                         
                            onClick={async () => {await this.getResultElection(id);}} 
                            type="button"
                            >Resultados
                        </button>
                    </td>
                </tr>
                )
            })
        }
    }

    render () {
        return <div id="electionsByAccount">
                <h3>Elecciones</h3>
                <hr />
                <br/>   
                <table className="table border">
                    <thead className="thead-dark">
                        <tr>
                            <th>Número</th>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Ya Voto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="electionTableByAccount">
                        {this.renderTableDataElectionsByAccount()}
                    </tbody>
                </table>
                <br/>
                <div className="modal" id="electionByAccountModal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Votar</h4>
                                <button 
                                    className="close" 
                                    data-dismiss="modal"
                                    type="button" 
                                    >&times;
                                </button>
                            </div>                                        
                            <div className="modal-body">
                                <VotingForm BEVService={this.props.BEVService} account={this.props.state.account}/>
                            </div>                                                                        
                        </div>
                    </div>
                </div>
            </div>
    }
}
