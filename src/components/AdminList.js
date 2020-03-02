import React, { Component } from "react";
import swal from 'sweetalert';

export class AdminList extends Component {

    constructor(props) {
        super(props);
        this.adminInput = React.createRef();
        this.clearTextAdminInput = this.clearTextAdminInput.bind(this);
    }
    
    clearTextAdminInput(){ 
        this.adminInput.current.value = ""; // Limpiar inputs de buscar
    }

    notify (receipt) {
        if(receipt.status == 200)
            swal("Transacción realizada correctamente!", "Comprobante: " + receipt.data.tx, "success");
        else
            swal("Error al realizar la transacción!", receipt.data, "error");
    }

    // Verifico si una cuenta es administador
    async isAdmin(address) {         
        let isAdmin = await this.props.BEVService.isAdmin(address);
        if(isAdmin)
            swal("Información", "El usuario " + address + " es administrador.", "info");
        else
        swal("Información", "El usuario " + address + " NO es administrador.", "info");
    }

    // Agregar un administrador
    async addAdmin(address) {        
        await this.props.BEVService.addAdmin(address, this.props.state.account).then((receipt) => {  
            this.notify(receipt);
        });
    }

    // Eliminar un administrador
    async deleteAdmin(address) {   
        await this.props.BEVService.deleteAdmin(address, this.props.state.account).then((receipt) => {  
            this.notify(receipt);
        });
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
                                                await this.isAdmin(address);                                                
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
                                                await this.addAdmin(address); 
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
                                                await this.deleteAdmin(address);                                                 
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