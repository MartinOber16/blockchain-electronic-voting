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
        let isAdmin = await this.props.BEVService.isAdmin(address);
        console.log("Is admin: ", isAdmin);
        if(isAdmin)
            return "El usuario es administrador.";
        else
            return "El usuario no es administrador.";
    }

    // Agregar un administrador
    async addAdmin(address) {        
        let transactionInfo;
        await this.props.BEVService.addAdmin(address, this.props.state.account).then((receipt) => {  
            console.log(receipt);              
            if(receipt.status == 200)
                transactionInfo = "Transaccion realizada correctamente: " + receipt.data.tx;
            else
                transactionInfo = receipt.data;
            
        });
        return transactionInfo;
    }

    // Eliminar un administrador
    async deleteAdmin(address) {
        let transactionInfo;     
        await this.props.BEVService.deleteAdmin(address, this.props.state.account).then((receipt) => {  
            console.log(receipt);               
            if(receipt.status == 200)
                transactionInfo = "Transaccion realizada correctamente: " + receipt.data.tx;
            else
                transactionInfo = receipt.data;
        });
        return transactionInfo;
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
                    >Limpiar
                </button>                            
                </div>
                <div className="btn-group col-sm-4">    
                    <table>
                        <thead></thead>
                        <tbody>
                        <tr>
                            <td>
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
                            </td>    
                            <td>
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
                            </td>
                            <td>
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
                                    >Quitar
                                </button>
                            </td>
                        </tr>  
                        </tbody>  
                    </table>                            
                </div>
            </div>
            <br />
            <p id="adminResult"></p>
        </div>);
    }
}