import React from "react";
import { useFormik } from 'formik';

// Valor a transferir para utilizar en la elección por costo para transacciones = 1 ether
//const valueElection = 1000000000000000000; 

// Formulario de elección
const ElectionForm = (props) => {
    const formik = useFormik({
        initialValues: {
            electionName: "",
            valueElection: 1
        },
        onSubmit: values => {      
            if(values.electionName != "") {
                if(values.valueElection > 0) {
                    let amount = props.web3.utils.toWei(values.valueElection.toString(), 'ether');
                    props.BEVService.addElection(values.electionName, props.account, amount).then((receipt) => {
                        let result;
                        if(receipt.status == 200)
                            result = "Transaccion realizada correctamente: " + receipt.data.tx;
                        else
                            result = receipt.data;
        
                        document.querySelector('#electionResult').innerText = result;
                    });
                    values.electionName = "";
                    values.valueElection = 1;
                    $('#electionModal').modal('hide');
                }
                else
                    alert("Debe ingresar una cantidad de etheres a utilizar en la elección.");
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
                        <div className="form-group">
                            <label htmlFor="electionName">Nombre de la Elección</label>
                            <input className="form-control" placeholder="Enter name"
                                id="electionName"
                                name="electionName"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.electionName}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="valueElection">Costo de la elección (ethers)</label>
                            <input className="form-control" placeholder="Enter value"
                                id="valueElection"
                                name="valueElection"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.valueElection}
                            />
                        </div>
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