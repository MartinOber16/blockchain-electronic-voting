import React from "react";
import { useFormik } from 'formik';

// TODO: input nro eleccion: mostrar solo las elecciones disponibles

// Formulario de candidato
const CandidateForm = (props) => {
    const formik = useFormik({
        initialValues: {
            idElectionCandidate: 0,
            candidateName: "",
        },
        onSubmit: values => {            
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