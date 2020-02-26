import React from "react";
import { useFormik } from 'formik';

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
            candidateName: ""
        },
        onSubmit: values => {    
            if(values.idElectionCandidate > 0) {
                if(values.candidateName != "") {
                    props.BEVService.addCandidate(values.idElectionCandidate, values.candidateName, props.account).then((receipt) => {
                        let result;
                        if(receipt.status == 200)
                            result = "Transaccion realizada correctamente: " + receipt.data.tx;
                        else
                            result = receipt.data;
        
                        document.querySelector('#candidateResult').innerText = result;
                    });
                    values.idElectionCandidate = 0;
                    values.candidateName = "";
                    $('#candidateModal').modal('hide');
                }
                else
                    alert("Debe ingresar el nombre del candidato.");

            }
            else
                alert("Debe seleccionar una elección valida.");

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
                        <div class="form-group">
                            <label htmlFor="idElectionCandidate">Elección</label>
                            <select 
                                className="form-control" 
                                id="idElectionCandidate"
                                name="idElectionCandidate"
                                onChange={formik.handleChange}
                                value={formik.values.idElectionCandidate}
                            >
                                <option key="0" value="0">Seleccione elección</option>
                                {renderSelectElections()}
                            </select>
                        </div>
                        <div class="form-group">
                            <label htmlFor="candidateName">Nombre del candidato</label>
                            <input className="form-control" placeholder="Enter name"
                                id="candidateName"
                                name="candidateName"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.candidateName}
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