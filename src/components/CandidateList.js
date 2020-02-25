import React, { Component } from "react";
import CandidateForm from "./CandidateForm";

export class CandidateList extends Component {

    constructor(props) {
        super(props);

    }

    // Obtener un candidato
    async getCandidate(election, id) {           
        let candidate;
        await this.props.BEVService.getCandidate(election, id).then((receipt) => {
            if(receipt.status == 200)
                candidate = JSON.stringify(receipt.data);
            else
                candidate = receipt.data;
        });
              
        return candidate;
    }

    // Eliminar un candidato
    async deleteCandidate(election, id) {          
        let transactionInfo;
        await this.props.BEVService.deleteCandidate(election, id, this.props.state.account).then((receipt) => {
            if(receipt.status == 200)
                transactionInfo = "Transaccion realizada correctamente: " + receipt.data.tx;
            else
                transactionInfo = receipt.data;
        });
        
        return transactionInfo;       
    }

    // Genero los registros con los datos de los candidatos
    renderTableDataCandidates() {
        return this.props.state.candidates.map((candidate, index ) => {
        const { election, id, name, voteCount } = candidate
        return (
                <tr key={index}>
                    <td>{election}</td>
                    <td>{name}</td>
                    <td>{voteCount}</td>
                    <td>
                        <button 
                            className="btn btn-info"                                                              
                            onClick={
                                async () => {
                                    let result = await this.getCandidate(election, id);
                                    document.querySelector('#candidateResult').innerText = result;
                                }
                            } 
                            type="button"
                            >Info
                        </button> 
                        <button 
                            className="btn btn-danger"                                  
                            onClick={
                                async () => {
                                    let result = await this.deleteCandidate(election, id);
                                    document.querySelector('#candidateResult').innerText = result;
                                }
                            } 
                            type="button"
                            >Borrar
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
                        {this.renderTableCandidates()}
                    <br/>
                    <div className="modal" id="candidateModal">
                        <CandidateForm BEVService={this.props.BEVService} account={this.props.state.account}/>
                    </div>
                    <p id="candidateResult"></p>
                </div>);
    }
}





 