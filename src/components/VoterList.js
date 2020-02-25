import React, { Component } from "react";
import VoterForm from "./VoterForm";

export class VoterList extends Component {

    constructor(props) {
        super(props);

    }

    // Obtener un votante
    async getVoter(election, address) {       
        let voter;
        await this.props.BEVService.getVoter(election, address).then((receipt) => {
            if(receipt.status == 200)
                voter = JSON.stringify(receipt.data);
            else
                voter = receipt.data;
        });
        
        return voter;
    }

    // Eliminar un votante
    async deleteVoter(election, address) {          
        let transactionInfo;
        await this.props.BEVService.deleteVoter(election, address, this.props.state.account).then((receipt) => {
            if(receipt.status == 200)
                transactionInfo = "Transaccion realizada correctamente: " + receipt.data.tx;
            else
                transactionInfo = receipt.data;
        });

        return transactionInfo;
    }

    // Genero los registros con los datos de los votantes
    renderTableDataVoters() {
        return this.props.state.voters.map((voter, index) => {
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
                        onClick={
                            async () => {
                                let result = await this.getVoter(election, address);
                                document.querySelector('#voterResult').innerText = result;
                            }
                        } 
                        type="button"
                        >Info
                    </button> 
                    <button 
                        className="btn btn-danger"                            
                        onClick={
                            async () => {
                                let result = await this.deleteVoter(election, address);
                                document.querySelector('#voterResult').innerText = result;
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

    renderTableVoters() {
        if(this.props.state.conected) {
            if(this.props.state.voters.length == 0)
                return <p>No hay votantes para mostrar.</p>
            else {
                return <table className="table border">
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
            }
        }
    }

    render() {
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
                    {this.renderTableVoters()}
                <br/>
                <div className="modal" id="voterModal">
                    <VoterForm BEVService={this.props.BEVService} account={this.props.state.account}/>
                </div>
                <p id="voterResult"></p>
            </div>);
    }
}
