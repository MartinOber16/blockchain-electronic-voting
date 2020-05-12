import React from "react";
import {okCode, errorCode} from "../../services/GlobalVariables";
import { useFormik } from 'formik';
import swal from 'sweetalert';

// Formulario de transferencia
const TransferForm = (props) => {
    const formik = useFormik({
        initialValues: {
            amount2: 0
        },
        onSubmit: values => {
                let amount = props.web3.utils.toWei(values.amount2.toString(), 'ether');
                if(amount > 0) {
                    props.BEVService.transferToContract(amount, props.account).then((receipt) => {
                        if(receipt.status == okCode)
                            swal("Transacción realizada correctamente!", receipt.data.tx, "success");
                        else
                            swal("Error al realizar la transacción!", receipt.data, "error"); 
                    });

                    values.amount2 = 0
                    $('#transferModal2').modal('hide');
                }
                else
                    swal("Error!", "Debe ingresar la cantidad de etheres a transferir.", "error");
            },
    });
    return (<div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title">Transferencia al contrato</h4>
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
                            <label htmlFor="amount2">Cantidad (ethers)</label>
                            <input className="form-control" placeholder="Enter value"
                                id="amount2"
                                name="amount2"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.amount2}
                            />
                        </div>
                        <br />
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" data-dismiss="modal">Cancelar</button>
                            <button type="submit" className="btn btn-success">Transferir</button>
                        </div>
                    </form>
                </div>                                                                        
            </div>
        </div>
    );
};

export default TransferForm;