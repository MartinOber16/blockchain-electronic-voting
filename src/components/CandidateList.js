import React, { Component } from "react";
import {okCode, errorCode} from "../../services/GlobalVariables";
import CandidateForm from "./CandidateForm";
import swal from '@sweetalert/with-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faAddressCard, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export class CandidateList extends Component {

    constructor(props) {
        super(props);
    }

    notify (receipt) {
        if(receipt.status == okCode)
            swal("Transacción realizada correctamente!", receipt.data.tx, "success");
        else
            swal("Error al realizar la transacción!", receipt.data, "error");

    }

    // Obtener un candidato
    async getCandidate(election, id) {           
        let candidate;
        await this.props.BEVService.getCandidate(election, id).then((receipt) => {
            /*if(receipt.status == okCode)
                candidate = receipt.data;
            else*/
                candidate = receipt.data;
        });
              
        return candidate;
    }

    // Eliminar un candidato
    async deleteCandidate(election, id) { 
        let eleccion = await this.props.BEVService.getElection(election);
        if(eleccion.data.estado === 0){
            await this.props.BEVService.deleteCandidate(election, id, this.props.state.account).then((receipt) => {
                this.notify(receipt);
            });
        }
        else{
            swal("Error al realizar la transacción!", "No se puede eliminar el candidato porque la elección ya esta iniciada o finalizada.", "error");
        }
    }

    // Información del candidato
    candidateDisplay(candidate) {
        swal(<div>
                <h3>{candidate.name}</h3>
                <hr/>
                <p>{candidate.description}</p>
                <hr/>
                <br/>
                <div className="form-group row">
                    <div className="col-sm-2"></div>
                    <label className="col-sm-4 control-label text-left"><strong>ID Candidato:</strong></label>
                    <div className="col-sm-2">
                        <p className="form-control-static">{candidate.id}</p>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2"></div>
                    <label className="col-sm-4 control-label text-left"><strong>ID Elección:</strong></label>
                    <div className="col-sm-2">
                        <p className="form-control-static">{candidate.election}</p>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-2"></div>
                    <label className="col-sm-4 control-label text-left"><strong>Votos:</strong></label>
                    <div className="col-sm-2">
                        <p className="form-control-static">{candidate.voteCount}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Genero los registros con los datos de los candidatos
    renderTableDataCandidates() {
        return this.props.state.candidates.map((candidate, index ) => {
        const { election, id, name, voteCount } = candidate
        return (
                <tr key={index}>
                    <td className="text-center">{election}</td>
                    <td>{name}</td>
                    <td className="text-center">{voteCount}</td>
                    <td>
                        <button 
                            className="btn btn-info"                                                              
                            onClick={
                                async () => {
                                    let candidate = await this.getCandidate(election, id);
                                    this.candidateDisplay(candidate);
                                }
                            } 
                            type="button"
                            ><FontAwesomeIcon icon={faAddressCard} />
                        </button> 
                        <button 
                            className="btn btn-danger"                                  
                            onClick={
                                async () => { await this.deleteCandidate(election, id); }
                            } 
                            type="button"
                            ><FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </td>
                </tr>
            )
        })
    }

    renderTableCandidates() {
        if(this.props.state.conected) {
            if(this.props.state.candidates.length == 0)
                return <p>No hay candidatos para mostrar.</p>
            else {
                return <table className="table border">
                        <thead className="thead-dark">
                            <tr>
                                <th>Elección</th>
                                <th>Nombre</th>
                                <th>Votos</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="candidateTable">
                            {this.renderTableDataCandidates()}
                        </tbody>
                    </table>
            }
        }
    }

    render() {
        return (<div id="candidates">
                    <h4>Candidatos</h4>
                    <hr />
                    <div className="input-group row">  
                        <div className="input-group-append col-sm-2">
                        </div>                                          
                        <div className="input-group-append col-sm-6">   
                            <input 
                                className="form-control" 
                                id="candidateInput" 
                                placeholder="Buscar" 
                                ref={ this.candidateInput } 
                                type="text" 
                                />                                                              
                        </div>  
                        <div className="btn-group col-sm-2">                                
                            <button 
                                className="btn btn-success" 
                                data-target="#candidateModal"
                                data-toggle="modal"                                        
                                type="button"                                             
                                ><FontAwesomeIcon icon={faPlusCircle} />
                            </button>
                        </div>
                    </div>
                    <br/>                    
                        {this.renderTableCandidates()}
                    <br/>
                    <div className="modal" id="candidateModal">
                        <CandidateForm 
                            account={this.props.state.account} 
                            BEVService={this.props.BEVService} 
                            elections={this.props.state.elections}
                        />
                    </div>
                </div>);
    }
}





 