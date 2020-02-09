import React, { Component } from "react";
import VoterForm from "./VoterForm";

export class VoterList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            voters: []
        };
    }

    // Obtengo todos los votantes
    async getVoters() {
        if(this.props.state.conected) {            
            let allVoters = await this.props.BEVService.getVoters();            
            this.setState({
                voters: allVoters
            });
        }
    }

    // Obtener un votante
    async getVoter(election, address) {
        if(this.props.state.conected) {            
            let voter = await this.props.BEVService.getVoter(election, address);
            console.log(voter[0]);        
            // return voter[0];
        }
    }

    // Eliminar un votante
    async deleteVoter(election, address) {
        if(this.props.state.conected) {            
            let transactionInfo = await this.props.BEVService.deleteVoter(election, address, this.props.state.account);
            console.log("Transacción: " + transactionInfo);
            // return transactionInfo;    
        }    
    }

    // Genero los registros con los datos de los votantes
    renderTableDataVoters () {
        this.getVoters();
        if(this.props.state.conected) {
            return this.state.voters.map((voter, index) => {
            const { election, address, name, voted } = voter
            return (
                <tr key={index}>
                    <td>{election}</td>
                    <td>{address}</td>
                    <td>{name}</td>
                    <td>{voted}</td>
                    <td>
                        <button 
                            className="btn btn-info"                            
                            onClick={async () => {await this.getVoter(election, address);}} 
                            type="button"
                            >Ver
                        </button> 
                        <button 
                            className="btn btn-danger"                            
                            onClick={async () => {await this.deleteVoter(election, address);}} 
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
        return (<div id="voters">
                <h4>Votantes</h4>
                <hr />
                <div className="input-group row">  
                    <div className="input-group-append col-sm-1">
                    </div>                                          
                    <div className="input-group-append col-sm-8">   
                        <input 
                            className="form-control" 
                            id="voterInput" 
                            placeholder="Buscar" 
                            ref= { this.voterInput } 
                            type="text" 
                            />                                                              
                        <button 
                            className="btn btn-primary"                                             
                            onClick={ this.clearTextVoterInput }
                            type="submit"
                            >Limpiar
                        </button>
                    </div>
                    <div className="btn-group col-sm-2">                                
                        <button
                            className="btn btn-success" 
                            data-target="#voterModal"
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
                            <th>Cuenta</th>
                            <th>Nombre</th>
                            <th>Ya voto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="voterTable">
                        {this.renderTableDataVoters()}
                    </tbody>
                </table>
                <br/>
                <div className="modal" id="voterModal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Nuevo Votante</h4>
                                <button                                                     
                                    className="close" 
                                    data-dismiss="modal"
                                    type="button"
                                    >&times;
                                </button>
                            </div>                                        
                            <div className="modal-body">
                                <VoterForm BEVService={this.props.BEVService} account={this.props.state.account}/>
                            </div>                                                                        
                        </div>
                    </div>
                </div>
            </div>);
    }
}
