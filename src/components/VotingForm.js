import React from "react";
import { useFormik } from 'formik';

// TODO: input nro eleccion y candidato: mostrar solo las elecciones y candidatos disponibles por cada una

// Formulario de votación
const VotingForm = (props) => {
    const formik = useFormik({
        initialValues: {
            electionIdVote: "",
            candidateVote: "",
        },
        onSubmit: values => {       
            props.BEVService.voting(values.electionIdVote, values.candidateVote, props.account).then((receipt) => {
                let result;
                if(receipt.status == 200)
                    result = "Transaccion realizada correctamente: " + receipt.data.tx;
                else   
                    result = receipt.data;

                document.querySelector('#electionByAccountResult').innerText = result;
            });
            values.electionIdVote = "";
            values.candidateVote = "";
            $('#electionByAccountModal').modal('hide');
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