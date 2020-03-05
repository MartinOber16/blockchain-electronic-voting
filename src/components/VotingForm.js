import React from "react";
import {okCode, errorCode} from "../../services/GlobalVariables";
import { useFormik } from 'formik';
import swal from 'sweetalert';

// Formulario de votación
const VotingForm = (props) => {
    const renderSelectElections = () => {
        return props.elections.map((election) => {
            const { id, name, active} = election
            if(active != "false") {
                return (
                    <option key={id} value={id}>{name}</option>
                )
            }
        })
    }
    const renderSelectCandidates = (e) => {
        return props.candidates.map((candidate) => {
            const { election, id, name} = candidate
            if(election == e){
                return (
                    <option key={id} value={id}>{name}</option>
                )
            }
        })
    }
    const formik = useFormik({
        initialValues: {
            electionIdVote: "",
            candidateVote: "",
        },
        onSubmit: values => {
            if(values.electionIdVote != "") {
                if(values.candidateVote != "") {
                    props.BEVService.voting(values.electionIdVote, values.candidateVote, props.account).then((receipt) => {
                        if(receipt.status == okCode)
                            swal("Transacción realizada correctamente!", receipt.data.tx, "success");
                        else
                            swal("Error al realizar la transacción!", receipt.data, "error"); 
                    });
                    values.electionIdVote = "";
                    values.candidateVote = "";
                    $('#electionByAccountModal').modal('hide');
                }
                else
                    swal("Error!", "Debe seleccionar un candidato.", "error");
            }   
            else
                swal("Error!", "Debe seleccionar una elección.", "error");
                 
        },
    });
    return (<div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title">Votar</h4>
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
                            <label htmlFor="electionIdVote">Elección</label>
                            <select 
                                className="form-control" 
                                id="electionIdVote"
                                name="electionIdVote"
                                onChange={formik.handleChange}
                                value={formik.values.electionIdVote}
                            >
                                <option key="0" value="0">Seleccione elección</option>
                                {renderSelectElections()}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="candidateVote">Candidato</label>
                            <select 
                                className="form-control" 
                                id="candidateVote"
                                name="candidateVote"
                                onChange={formik.handleChange}
                                value={formik.values.candidateVote}
                            >
                                <option key="0" value="0">Seleccione candidato</option>
                                {renderSelectCandidates(formik.values.electionIdVote)}
                            </select>
                        </div>
                        <br />
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" data-dismiss="modal">Cancelar</button>
                            <button type="submit" className="btn btn-success">Votar</button>
                        </div>
                    </form>
                </div>                                                                        
            </div>
        </div>
    );
};

export default VotingForm;