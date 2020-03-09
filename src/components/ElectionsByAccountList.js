import React, { Component } from "react";
import {okCode, errorCode} from "../../services/GlobalVariables";
import VotingForm from "./VotingForm";
import swal from '@sweetalert/with-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faPollH, faVoteYea} from '@fortawesome/free-solid-svg-icons';

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
            /*if(receipt.status == okCode)
                candidatesByElection = receipt.data;
            else*/
                candidatesByElection = receipt.data;
        });
        
        return candidatesByElection;
    }

    renderBoolean(value) {
        if(value == "true")
            return "Si";
        else
            return "No";
    }

    // Información del candidato
    candidateWinDisplay(candidate) {
        swal(<div>
                <h3>Candidato ganador</h3>
                <hr/>
                <br/>
                <div className="form-group row">
                    <div className="col-sm-2"></div>
                    <label className="col-sm-2 control-label text-left"><strong>Nombre:</strong></label>
                    <div className="col-sm-6">
                        <p className="form-control-static">{candidate.name}</p>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2"></div>
                    <label className="col-sm-2 control-label text-left"><strong>Votos:</strong></label>
                    <div className="col-sm-6">
                        <p className="form-control-static">{candidate.voteCount}</p>
                    </div>
                </div>
            </div>
        );
    }

    electionDetailsDisplay(result){
        let totalVotos = 0;
        let electionDetails = result.map((candidate ) => {
            const {id, name, voteCount } = candidate
            totalVotos += voteCount;
            return (<tr key={id}><td>{id}</td><td className="text-left">&nbsp;{name}</td><td className="text-right">{voteCount}</td></tr>);
        });

        swal(<div>
                <h3>Detalles de la votación</h3>
                <hr/>
                <br/>
                <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <table>
                            <thead className="thead-dark">
                                <tr>
                                    <th>Número</th>                                
                                    <th>Nombre</th>
                                    <th>Votos</th>
                                </tr>
                            </thead>
                            <tbody id="electionTableByAccount">
                                {electionDetails}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <br/>
                <hr/>
                <div className="row">
                    <div className="col-sm-2"></div>
                    <div className="col-sm-8">
                        <span className="text-center">Total de votos: {totalVotos}</span> 
                    </div>
                </div>
            </div>
        );
    }

    renderTableDataElectionsByAccount () {
        if(this.props.state.conected) {
            return this.props.state.electionsByAccount.map((election) => {
            const { id, name, active, candidatesCount, votersCount, yaVoto } = election
            return (
                <tr key={id}>
                    <td className="text-center">{id}</td>
                    <td>{name}</td>
                    <td>{this.renderBoolean(active)}</td>
                    <td className="text-center">{candidatesCount}</td>
                    <td className="text-center">{votersCount}</td>
                    <td>{this.renderBoolean(yaVoto)}</td>
                    <td>
                        <button 
                            className="btn btn-primary"                                                         
                            onClick={
                                    async () => {                                        
                                        if(yaVoto != "false") {
                                            let result = await this.getResultElection(id);
                                            if(result.status == okCode)
                                                this.candidateWinDisplay(result.data);
                                            else
                                                swal(result.data, "Para mas información seleccionar la opcion 'Detalles'", "info");             
                                            
                                        }  
                                        else
                                            swal("Error al realizar la transacción!", "Aun no ha emitido su voto.", "error");
                                        
                                }
                            } 
                            type="button"
                            ><FontAwesomeIcon icon={faAward} />
                        </button>
                        <button 
                            className="btn btn-info"                                                         
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
                            ><FontAwesomeIcon icon={faPollH} />
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
                        <th>Activa</th>
                        <th>Candidatos</th>
                        <th>Votantes</th>
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
                            className="btn btn-success" 
                            data-target="#electionByAccountModal"
                            data-toggle="modal"
                            type="button"                                                   
                            >Votar <FontAwesomeIcon icon={faVoteYea} />
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
