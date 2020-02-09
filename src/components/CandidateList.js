import React, { Component } from "react";
import CandidateForm from "./CandidateForm";

export class CandidateList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            candidates: []
        };
    }

    // Obtengo todos los candidatos
    async getCandidates() {
        if(this.props.state.conected) {            
            let allCandidates = await this.props.BEVService.getCandidates();            
            this.setState({
                candidates: allCandidates
            });
        }
    }

    // Obtener un candidato
    async getCandidate(election, id) {
        if(this.props.state.conected) {             
            let candidate = await this.props.BEVService.getCandidate(election, id);
            console.log(candidate[0]);        
            // return candidate[0];
        }
    }

    // Eliminar un candidato
    async deleteCandidate(election, id) {
        if(this.props.state.conected) {            
            let transactionInfo = await this.props.BEVService.deleteCandidate(election, id, this.props.state.account);
            console.log("Transacción: " + transactionInfo);
            // return transactionInfo;
        }        
    }

    // Genero los registros con los datos de los candidatos
    renderTableDataCandidates () {
        if(this.props.state.conected) { 
            this.getCandidates();           
            return this.state.candidates.map((candidate, index ) => {
            const { election, id, name, voteCount } = candidate
            return (
                    <tr key={index}>
                        <td>{election}</td>
                        <td>{name}</td>
                        <td>{voteCount}</td>
                        <td>
                            <button 
                                className="btn btn-info"                                                              
                                onClick={async () => {await this.getCandidate(election, id);}} 
                                type="button"
                                >Ver
                            </button> 
                            <button 
                                className="btn btn-danger"                                  
                                onClick={async () => {await this.deleteCandidate(election, id);}} 
                                type="button"
                                >Eliminar
                            </button>
                        </td>
                    </tr>
                )
            })
        }
    }

    render () {
        return (<div id="candidates">
                    <h4>Candidatos</h4>
                    <hr />
                    <div className="input-group row">  
                        <div className="input-group-append col-sm-1">
                        </div>                                          
                        <div className="input-group-append col-sm-8">   
                            <input 
                                className="form-control" 
                                id="candidateInput" 
                                placeholder="Buscar" 
                                ref={ this.candidateInput } 
                                type="text" 
                                />                                                              
                            <button 
                                className="btn btn-primary"                                             
                                onClick={ this.clearTextCandidateInput }
                                type="button"
                                >Limpiar
                            </button>
                        </div>
                        <div className="btn-group col-sm-2">                                
                            <button 
                                className="btn btn-success" 
                                data-target="#candidateModal"
                                data-toggle="modal"                                        
                                type="button"                                             
                                >Nuevo
                            </button>
                        </div>
                    </div>
                    <br/>                    
                    <table className="table border">
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
                    <br/>
                    <div className="modal" id="candidateModal">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title">Nuevo Candidato</h4>
                                    <button 
                                        className="close" 
                                        data-dismiss="modal"
                                        type="button" 
                                        >&times;
                                    </button>
                                </div>                                        
                                <div className="modal-body">
                                    <CandidateForm BEVService={this.props.BEVService} account={this.props.state.account}/>
                                </div>                                                                        
                            </div>
                        </div>
                    </div>
                </div>);
    }
}





 