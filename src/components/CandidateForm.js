import React from "react";
import {okCode, errorCode} from "../../services/GlobalVariables";
import { useFormik } from 'formik';
import swal from 'sweetalert';

// Formulario de candidato
const CandidateForm = (props) => {
    const renderSelectElections = () => {
        return props.elections.map((election) => {
            const { id, name} = election
            return (
                    <option key={id} value={id}>{name}</option>
            )
        })
    }
    const formik = useFormik({
        initialValues: {
            idElectionCandidate: 0,
            candidateName: "",
            candidateProposal: ""
        },
        onSubmit: values => {    
            if(values.idElectionCandidate > 0) {
                if(values.candidateName != "") {
                    props.BEVService.addCandidate(values.idElectionCandidate, values.candidateName, values.candidateProposal, props.account).then((receipt) => {
                        if(receipt.status == okCode)
                            swal("Transacción realizada correctamente!", receipt.data.tx, "success");
                        else
                            swal("Error al realizar la transacción!", receipt.data, "error");
                    });
                    values.idElectionCandidate = 0;
                    values.candidateName = "";
                    values.candidateProposal = "";
                    $('#candidateModal').modal('hide');
                }
                else
                    swal("Error!", "Debe ingresar el nombre del candidato.", "error");

            }
            else
                swal("Error!", "Debe seleccionar una elección valida.", "error");

        },
    });
    return (<div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title">Nuevo Candidato</h4>
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
                            <label htmlFor="idElectionCandidate">Elección</label>
                            <select 
                                className="form-control" 
                                id="idElectionCandidate"
                                name="idElectionCandidate"
                                onChange={formik.handleChange}
                                value={formik.values.idElectionCandidate}
                            >
                                <option key="0" value="0">Seleccione una elección</option>
                                {renderSelectElections()}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="candidateName">Nombre del candidato</label>
                            <input className="form-control" placeholder="Ingrese el nombre del candidato."
                                id="candidateName"
                                name="candidateName"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.candidateName}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="candidateProposal">Propuesta del candidato</label>
                            <textarea className="form-control" placeholder="Ingrese la propuesta del candidato."
                                id="candidateProposal"
                                name="candidateProposal"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.candidateProposal}
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

export default CandidateForm;