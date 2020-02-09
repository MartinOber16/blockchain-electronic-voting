import React, { Component } from "react";

export class AdminList extends Component {

    constructor(props) {
        super(props);
        this.adminInput = React.createRef();
        this.clearTextAdminInput = this.clearTextAdminInput.bind(this);
    }
    
    clearTextAdminInput(){ 
        this.adminInput.current.value = ""; // Limpiar inputs de buscar
    }

    // Verifico si una cuenta es administador
    async isAdmin(address) {
        if(this.props.state.conected) {            
            let isAdmin = await this.props.BEVService.isAdmin(address);
            return isAdmin;
        }
    }

    // Agregar un administrador
    async addAdmin(address) {
        if(this.props.state.conected) {            
            let transactionInfo = await this.props.BEVService.addAdmin(address, this.props.state.account);        
            console.log("Transacción: " + transactionInfo);
            return transactionInfo.tx;
        }
    }

    // Eliminar un administrador
    async deleteAdmin(address) {
        if(this.props.state.conected) {          
            let transactionInfo = await this.props.BEVService.deleteAdmin(address, this.props.state.account);        
            console.log("Transacción: " + transactionInfo);
            return transactionInfo.tx;
        }
    }

    render () {
        return (<div id="adminUsers">
            <h4>Administradores</h4>
            <hr />
            <div className="input-group row">                                           
                <div className="input-group-append col-sm-8">   
                    <input 
                        className="form-control"
                        id="adminInput"
                        placeholder="Buscar"
                        ref = { this.adminInput } 
                        type="text" />
                    <button 
                        className="btn btn-primary" 
                        onClick={ this.clearTextAdminInput }
                        type="button"                                             
                    >Limpiar</button>                                                        
                </div>
                <div className="btn-group col-sm-4">                                
                    <button 
                        className="btn btn-info"                                                                                         
                        onClick={ 
                            async () => {                                                                                                    
                                    let address = document.querySelector('#adminInput').value;                                                                                                    
                                    let result = await this.isAdmin(address);                                                                                                     
                                    document.querySelector('#adminResult').innerText = result;
                                }
                            }
                        type="button" 
                        >Comprobar
                    </button> 
                    <button 
                        className="btn btn-success"                                            
                        onClick={ 
                            async () => {                                                                                                    
                                    let address = document.querySelector('#adminInput').value;
                                    let result = await this.addAdmin(address);                                                                                                     
                                    document.querySelector('#adminResult').innerText = result;
                                }
                            }
                        type="button" 
                        >Agregar
                    </button> 
                    <button 
                        className="btn btn-danger"
                        type="button"  
                        onClick={ 
                            async () => {
                                    let address = document.querySelector('#adminInput').value;                                                                                                    
                                    let result = await this.deleteAdmin(address);                                                                                                     
                                    document.querySelector('#adminResult').innerText = result;
                                }
                            } 
                        >Eliminar
                    </button>
                </div>
            </div>
            <br />
            <p id="adminResult"></p>
        </div>);
    }
}