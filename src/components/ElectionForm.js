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
            props.BEVService.addElection(values.electionName, props.account, valueElection).then((receipt) => {
                console.log(receipt);
                document.querySelector('#electionResult').innerText = "Transaccion realizada correctamente: " + receipt.data.tx;
            });
            values.electionName = "";
        },
    });
    return (
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
            <button type="submit" className="btn btn-success">Guardar</button>
        </div>
        </form>
    );
};

export default ElectionForm;