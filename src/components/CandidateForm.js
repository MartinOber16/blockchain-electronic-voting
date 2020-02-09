import React from "react";
import { useFormik } from 'formik';

// Formulario de candidato
const CandidateForm = (props) => {
    const formik = useFormik({
        initialValues: {
            idElectionCandidate: 0,
            candidateName: "",
        },
        onSubmit: values => {            
            props.BEVService.addCandidate(values.idElectionCandidate, values.candidateName, props.account).then((receipt) => {
                console.log(receipt);
            });
            values.idElectionCandidate = 0;
            values.candidateName = "";
        },
    });
    return (
        <form onSubmit={formik.handleSubmit}>
        <label htmlFor="idElectionCandidate">Nro de Elección</label>
        <input className="form-control" placeholder="Enter election"
            id="idElectionCandidate"
            name="idElectionCandidate"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.idElectionCandidate}
        />
        <label htmlFor="candidateName">Nombre del candidato</label>
        <input className="form-control" placeholder="Enter name"
            id="candidateName"
            name="candidateName"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.candidateName}
        />
        <br />
        <div className="modal-footer">
            <button type="submit" className="btn btn-success">Guardar</button>
        </div>
        </form>
    );
};

export default CandidateForm;