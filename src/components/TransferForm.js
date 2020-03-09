import React from "react";
import {okCode, errorCode} from "../../services/GlobalVariables";
import { useFormik } from 'formik';
import swal from 'sweetalert';

// Formulario de transferencia
const TransferForm = (props) => {
    const formik = useFormik({
        initialValues: {
            toAddress: "",
            amount: 0
        },
        onSubmit: values => {
            if(values.toAddress != "") {
                let amount = props.web3.utils.toWei(values.amount.toString(), 'ether');
                if(amount > 0) {
                    let contractBalance = 0; 
                    props.BEVService.getContractBalance().then((receipt) => {
                        contractBalance = receipt;
                                                
                        if(amount < contractBalance) {
                            props.BEVService.transferFromContract(values.toAddress, amount, props.account).then((receipt) => {
                                if(receipt.status == okCode)
                                    swal("Transacción realizada correctamente!", receipt.data.tx, "success");
                                else
                                    swal("Error al realizar la transacción!", receipt.data, "error"); 
                            });
                            
                            values.toAddress = "",
                            values.amount = 0
                            $('#transferModal').modal('hide');
                        }
                        else
                            swal("Error!", "No hay saldo suficiente para la transferencia.", "error"); 
                        
                    });
                }
                else
                    swal("Error!", "Debe ingresar la cantidad de etheres a transferir.", "error");

            }
            else
                swal("Error!", "Debe ingresar una cuenta valida.", "error");

        },
    });
    return (<div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title">Transferencia</h4>
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
                            <label htmlFor="toAddress">Cuenta destino</label>
                            <input className="form-control" placeholder="Enter address"
                                id="toAddress"
                                name="toAddress"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.toAddress}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="amount">Cantidad (ethers)</label>
                            <input className="form-control" placeholder="Enter value"
                                id="amount"
                                name="amount"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.amount}
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