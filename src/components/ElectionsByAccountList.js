import React, { Component } from "react";
import VotingForm from "./VotingForm";

export class ElectionsByAccountList extends Component {

    constructor(props) {
        super(props);

    }

    async getResultElection (election) {        
        let candidatoGanador;
        await this.props.BEVService.getResultElection(election).then((receipt) => {
            console.log(receipt);
            if(receipt.status == 200)
                candidatoGanador = receipt.data;

        });

        return candidatoGanador;
    }

    // Obtener todos los candidatos de una elección
    async getCandidatesByElection(election) {        
        let candidatesByElection;
        await this.props.BEVService.getCandidatesByElection(election).this((receipt) => {
            console.log(receipt);
            if(receipt.status == 200)
                candidatesByElection = receipt.data;
        });
        
        return candidatesByElection;
    }

    renderTableDataElectionsByAccount () {
        if(this.props.state.conected) {
            return this.props.state.electionsByAccount.map((election) => {
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
                            onClick={
                                    async () => {
                                    let result = await this.getResultElection(id);
                                    document.querySelector('#electionByAccountResult').innerText = JSON.stringify(result);
                                }
                            } 
                            type="button"
                            >Resultados
                        </button>
                    </td>
                </tr>
                )
            })
        }
    }

    renderTableElectionsByAccount () {
        if(this.props.state.conected) {
            if(this.props.state.electionsByAccount.length == 0)
                return <p>No hay elecciones para mostrar.</p>
            else {  
                return <table className="table border">
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
            }
        }
    }

    render () {
        return <div id="electionsByAccount">
                <h3>Elecciones</h3>
                <hr />
                <br/>   
                {this.renderTableElectionsByAccount()}
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
                <p id="electionByAccountResult"></p>
            </div>
    }
}
