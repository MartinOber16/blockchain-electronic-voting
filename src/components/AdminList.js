import React, { Component } from "react";
import {okCode, errorCode} from "../../services/GlobalVariables";
import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faUserCheck, faBroom, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

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
        if(receipt.status == okCode)
            swal("Transacción realizada correctamente!", "Comprobante: " + receipt.data.tx, "success");
        else
            swal("Error al realizar la transacción!", receipt.data, "error");
    }

    // Verifico si una cuenta es administador
    async isAdmin(address) { 
        let msj = "";
        if(address != ""){
            let isAdmin = await this.props.BEVService.isAdmin(address);
            if(isAdmin)
                msj = "El usuario " + address + " es administrador.";
            else
                msj = "El usuario " + address + " NO es administrador.";
                
            swal("",msj, "info");
        }
        else
            swal("Error","Debe ingresar una cuenta valida.", "error");

    }

    // Agregar un administrador
    async addAdmin(address) {      
        if(address != ""){  
            await this.props.BEVService.addAdmin(address, this.props.state.account).then((receipt) => {  
                this.notify(receipt);
            });
        }
        else
            swal("Error","Debe ingresar una cuenta valida.", "error");
    }

    // Eliminar un administrador
    async deleteAdmin(address) {
        if(address != ""){     
            await this.props.BEVService.deleteAdmin(address, this.props.state.account).then((receipt) => {  
                this.notify(receipt);
            });
        }
        else
            swal("Error","Debe ingresar una cuenta valida.", "error");
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
                    className="btn btn-secondary" 
                    onClick={ this.clearTextAdminInput }
                    type="button">
                    <FontAwesomeIcon icon={faBroom} />
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
                                    type="button">
                                    <FontAwesomeIcon icon={faUserCheck} />
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
                                    type="button">
                                    <FontAwesomeIcon icon={faPlusCircle} />
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
                                    >
                                    <FontAwesomeIcon icon={faTrashAlt} />
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