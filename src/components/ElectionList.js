import React, { Component } from "react";
import ElectionForm from "./ElectionForm";

export class ElectionList extends Component {

    constructor(props) {
        super(props);

    }
    
    // Obtengo una eleccion    
    async getElection(id) {         
        let election;
        await this.props.BEVService.getElection(id).then((receipt) => {
            console.log(receipt);        
            if(receipt.status == 200)
                election = JSON.stringify(receipt.data);
            else
                election = receipt.data;
            
        });
        return election;
    }

    // Eliminar una elección
    async deleteElection(id) {
        let transactionInfo;
        await this.props.BEVService.deleteElection(id, this.props.state.account).then((receipt) => {
            console.log(receipt);
            if(receipt.status == 200)
                transactionInfo = "Transaccion realizada correctamente: " + receipt.data.tx;
            else
                transactionInfo = receipt.data;

        });
        return transactionInfo;
    }

    // Genero los registros con los datos de las elecciones
    renderTableDataElections() {                      
        return this.props.state.elections.map((election) => {
            const { id, name, active, candidatesCount, votersCount } = election
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{active}</td>
                    <td>{candidatesCount}</td>
                    <td>{votersCount}</td>
                    <td>
                        <button 
                            className="btn btn-info"
                            onClick={
                                async () => {
                                    let result = await this.getElection(id);
                                    document.querySelector('#electionResult').innerText = result;
                                }
                            }
                            type="button"                            
                            >Ver
                        </button> 
                        <button 
                            className="btn btn-danger"                              
                            onClick={
                                async () => {
                                    let result = await this.deleteElection(id);
                                    document.querySelector('#electionResult').innerText = result;
                                    }
                                } 
                            type="button"
                            >Eliminar
                        </button>
                    </td>
                </tr>
            )
        })
    }

    renderTableElections() {
            if(this.props.state.elections.length == 0)
                return <p>No hay elecciones para mostrar.</p>
            else {
                return <table className="table border">
                    <thead className="thead-dark">
                        <tr>
                            <th>Número</th>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Candidatos</th>
                            <th>Votantes</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="electionTable">
                        {this.renderTableDataElections()}
                    </tbody>
                </table>
            }
    }

    render() {
        return <div id="elections">
                <h4>Elecciones</h4>
                <hr />
                <div className="input-group row">  
                    <div className="input-group-append col-sm-1"></div>                                          
                    <div className="input-group-append col-sm-8">   
                        <input 
                            className="form-control" 
                            id="electionInput" 
                            placeholder="Buscar" 
                            ref={ this.electionInput } 
                            type="text" 
                        /> 
                        <button 
                            className="btn btn-primary"                                             
                            onClick={ this.clearTextElectionInput }
                            type="button"
                            >Limpiar
                        </button>                                                           
                    </div>
                    <div className="btn-group col-sm-2">                                
                        <button 
                            className="btn btn-success" 
                            data-target="#electionModal"
                            data-toggle="modal"                                         
                            type="button"                                             
                            >Nueva
                        </button>
                    </div>
                </div>
                <br/>  
                {this.renderTableElections()}                  
                <br/>
                <div className="modal" id="electionModal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Nueva Elección</h4>
                                <button 
                                    className="close" 
                                    data-dismiss="modal"
                                    type="button" 
                                    >&times;
                                </button>
                            </div>                                        
                            <div className="modal-body">
                                <ElectionForm BEVService={this.props.BEVService} account={this.props.state.account}/>
                            </div>                                                                        
                        </div>
                    </div>
                </div>
                <p id="electionResult"></p>
            </div>
    }
}
