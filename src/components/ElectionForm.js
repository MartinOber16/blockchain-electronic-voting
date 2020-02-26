import React from "react";
import { useFormik } from 'formik';

// Valor a transferir para utilizar en la elección por costo para transacciones = 1 ether
const valueElection = 1000000000000000000; 

// Formulario de elección
const ElectionForm = (props) => {
    const formik = useFormik({
        initialValues: {
            electionName: "",
        },
        onSubmit: values => {      
            if(values.electionName != "") {
                props.BEVService.addElection(values.electionName, props.account, valueElection).then((receipt) => {
                    let result;
                    if(receipt.status == 200)
                        result = "Transaccion realizada correctamente: " + receipt.data.tx;
                    else
                        result = receipt.data;
    
                    document.querySelector('#electionResult').innerText = result;
                });
                values.electionName = "";
                $('#electionModal').modal('hide');
            }
            else
                alert("Debe ingresar un nombre para la elección.");
        },
    });
    return (<div className="modal-dialog">
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
                    <form onSubmit={formik.handleSubmit}>
                    <label htmlFor="electionName">Nombre de la Elección</label>
                    <input className="form-control" placeholder="Enter name"
                        id="electionName"
                        name="electionName"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.electionName}
                    />
                    <br />
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light" data-dismiss="modal">Cancelar</button>
                        <button type="submit" className="btn btn-success">Guardar</button>
                    </div>
                    </form>
                </div>                                                                        
            </div>
        </div>
    );
};

export default ElectionForm;