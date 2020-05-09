import React from "react";
import {okCode, errorCode} from "../../services/GlobalVariables";
import { useFormik } from 'formik';
import swal from 'sweetalert';

// Formulario de votante
const VoterForm = (props) => {
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
            idElectionVoter: 0,
            voterAddress: "",
            voterIdentification: "",
            voterDescription: ""
        },
        onSubmit: values => {
            if(values.idElectionVoter > 0) {
                if(values.voterAddress != "") {
                    if(values.voterIdentification != "") {
                        props.BEVService.addVoter(values.idElectionVoter, values.voterAddress, values.voterIdentification, values.voterDescription, props.account).then((receipt) => {
                            if(receipt.status == okCode)
                                swal("Transacción realizada correctamente!", receipt.data.tx, "success");
                            else
                                swal("Error al realizar la transacción!", receipt.data, "error"); 
                        });
                        values.idElectionVoter = 0;
                        values.voterAddress = "";
                        values.voterIdentification = "";
                        values.voterDescription = "";
                        $('#voterModal').modal('hide');
                    }
                    else
                        swal("Error!","Debe ingresar una identificación para el votante.", "error");

                }
                else
                    swal("Error!", "Debe ingresar una cuenta valida.", "error");

            }
            else
                swal("Error!", "Debe seleccionar una elección.", "error");

        },
    });
    return (<div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title">Nuevo Votante</h4>
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
                            <label htmlFor="idElectionVoter">Elección</label>
                            <select 
                                className="form-control" 
                                id="idElectionVoter"
                                name="idElectionVoter"
                                onChange={formik.handleChange}
                                value={formik.values.idElectionVoter}
                            >
                                <option key="0" value="0">Seleccione elección</option>
                                {renderSelectElections()}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="voterAddress">Cuenta del Votante</label>
                            <input className="form-control" placeholder="Enter address"
                                id="voterAddress"
                                name="voterAddress"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.voterAddress}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="voterIdentification">Identificación personal</label>
                            <input className="form-control" placeholder="Enter personal identification"
                                id="voterIdentification"
                                name="voterIdentification"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.voterIdentification}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="voterDescription">Descripción</label>
                            <input className="form-control" placeholder="Enter description"
                                id="voterDescription"
                                name="voterDescription"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.voterDescription}
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

export default VoterForm;