import React from "react";
import { useFormik } from 'formik';

// Formulario de votante
const VoterForm = (props) => {
    const formik = useFormik({
        initialValues: {
            idElectionVoter: 0,
            voterAddress: "",
            voterName: "",
        },
        onSubmit: values => {
            props.BEVService.addVoter(values.idElectionVoter, values.voterAddress, values.voterName, props.account).then((receipt) => {
                console.log(receipt);
                document.querySelector('#voterResult').innerText = "Transaccion realizada correctamente: " + receipt.data.tx;
            });
            values.idElectionVoter = 0;
            values.voterAddress = "";
            values.voterName = "";
        },
    });
    return (
        <form onSubmit={formik.handleSubmit}>
        <label htmlFor="idElectionVoter">Nro de Elección</label>
        <input className="form-control" placeholder="Enter election"
            id="idElectionVoter"
            name="idElectionVoter"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.idElectionVoter}
        />
        <label htmlFor="voterAddress">Cuenta del Votante</label>
        <input className="form-control" placeholder="Enter address"
            id="voterAddress"
            name="voterAddress"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.voterAddress}
        />
        <label htmlFor="voterName">Nombre del Votante</label>
        <input className="form-control" placeholder="Enter name"
            id="voterName"
            name="voterName"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.voterName}
        />
        <br />
        <div className="modal-footer">
            <button type="submit" className="btn btn-success">Guardar</button>
        </div>
        </form>
    );
};

export default VoterForm;