import React from "react";
import { useFormik } from 'formik';

// Formulario de votación
const VotingForm = (props) => {
    const formik = useFormik({
        initialValues: {
            electionIdVote: "",
            candidateVote: "",
        },
        onSubmit: values => {          
            props.BEVService.voting(values.electionIdVote, values.candidateVote, props.account).then((receipt) => {
                console.log(receipt);
                document.querySelector('#electionByAccountResult').innerText = "Transaccion realizada correctamente: " + receipt.data.tx;
            });
            values.electionIdVote = "";
            values.candidateVote = "";
        },
    });
    return (
        <form onSubmit={formik.handleSubmit}>
        <label htmlFor="electionIdVote">Elección</label>
        <input className="form-control" placeholder="Enter electionIdVote"
            id="electionIdVote"
            name="electionIdVote"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.electionIdVote}
        />
        <label htmlFor="candidateVote">Candidato</label>
        <input className="form-control" placeholder="Enter candidate"
            id="candidateVote"
            name="candidateVote"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.candidateVote}
        />
        <br />
        <div className="modal-footer">
            <button type="submit" className="btn btn-success">Votar</button>
        </div>
        </form>
    );
};

export default VotingForm;