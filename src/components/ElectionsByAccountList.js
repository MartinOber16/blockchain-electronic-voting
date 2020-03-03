import React, { Component } from "react";
import VotingForm from "./VotingForm";
import swal from '@sweetalert/with-react';

export class ElectionsByAccountList extends Component {

    constructor(props) {
        super(props);
    }

    // Obtener el candidato ganador de la elección
    async getResultElection(election) {
        let response;
        await this.props.BEVService.getResultElection(election).then((receipt) => {
            response = receipt;
        });

        return response;
    }

    // Obtener todos los candidatos de una elección
    async getDetailsByElection(election) {     
        let candidatesByElection;
        await this.props.BEVService.getDetailsByElection(election).then((receipt) => {
            /*if(receipt.status == 200)
                candidatesByElection = receipt.data;
            else*/
                candidatesByElection = receipt.data;
        });
        
        return candidatesByElection;
    }

    // Información del candidato
    candidateWinDisplay(candidate) {
        swal(<div>
                <h3>Candidato ganador</h3>
                <br/>
                <br/>
                <div className="form-group row">
                    <div className="col-sm-2"></div>
                    <label className="col-sm-2 control-label text-left"><strong>Nombre:</strong></label>
                    <div className="col-sm-4">
                        <p className="form-control-static">{candidate.name}</p>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2"></div>
                    <label className="col-sm-2 control-label text-left"><strong>Votos:</strong></label>
                    <div className="col-sm-4">
                        <p className="form-control-static">{candidate.voteCount}</p>
                    </div>
                </div>
            </div>
        );
    }

    electionDetailsDisplay(result){
        let component = result.map((candidate ) => {
            const {id, name, voteCount } = candidate
            return (<li key={id}>{name}: {voteCount} votos.</li>);
        });

        swal(<div>
                <h3>Detalles de la votación</h3>
                <br/>
                <div className="form-group row">
                    <div className="col-sm-2"></div>
                    <ul className="col-sm-6">
                        {component}
                    </ul>
                </div>
            </div>
        );
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
                            className="btn btn-link"                                                         
                            onClick={
                                    async () => {                                        
                                        if(yaVoto != "false") {
                                            let result = await this.getResultElection(id);
                                            if(result.status == 200)
                                                this.candidateWinDisplay(result.data);
                                            else
                                                swal(result.data, "Para mas información seleccionar la opcion 'Detalles'", "info");             
                                            
                                        }  
                                        else
                                            swal("Error al realizar la transacción!", "Aun no ha emitido su voto.", "error");
                                        
                                }
                            } 
                            type="button"
                            >Resultados
                        </button>
                        <button 
                            className="btn btn-link"                                                         
                            onClick={
                                    async () => {
                                        if(yaVoto != "false") {
                                            let result = await this.getDetailsByElection(id);
                                            this.electionDetailsDisplay(result);
                                        }
                                        else
                                            swal("Error al realizar la transacción!", "Aun no ha emitido su voto.", "error");
                                }
                            } 
                            type="button"
                            >Detalles
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
                <div className="input-group row">  
                    <div className="input-group-append col-sm-2">
                    </div>                   
                    <div className="input-group-append col-sm-6">   
                        <input 
                            className="form-control" 
                            id="votingInput" 
                            placeholder="Buscar" 
                            ref= { this.votingInput } 
                            type="text" 
                            />                                                              
                    </div>
                    <div className="input-group-append col-sm-1">
                    </div>  
                    <div className="btn-group col-sm-2">                                
                        <button 
                            className="btn btn-primary" 
                            data-target="#electionByAccountModal"
                            data-toggle="modal"
                            type="button"                                                   
                            >Votar
                        </button>
                    </div>
                </div>
                <br/>   
                {this.renderTableElectionsByAccount()}
                <br/>
                <div className="modal" id="electionByAccountModal">
                    <VotingForm 
                        account={this.props.state.account}
                        BEVService={this.props.BEVService}                         
                        candidates={this.props.state.candidates}
                        elections={this.props.state.electionsByAccount}
                    />
                </div>
                <p id="electionByAccountResult"></p>
            </div>
    }
}
