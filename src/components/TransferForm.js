import React from "react";
import { useFormik } from 'formik';

// Formulario de transferencia
const TransferForm = (props) => {
    const formik = useFormik({
        initialValues: {
            toAddress: "",
            amount: 0
        },
        onSubmit: values => {
            if(values.toAddress != "") {
                if(values.amount > 0) {
                    let amountWei = props.web3.utils.toWei(values.amount.toString(), 'ether');
                    props.BEVService.transferFromContract(values.toAddress, amountWei, props.account).then((receipt) => {
                        if(receipt.status == 200)
                            swal("Transacción realizada correctamente!", "Recibo: " + receipt.data.tx, "success");
                        else
                            swal("Error al realizar la transacción!", receipt.data, "error"); 
                    });
                    
                    values.toAddress = "",
                    values.amount = 0
                    $('#transferModal').modal('hide');
                }
                else
                    alert("Debe ingresar la cantidad de etheres a transferir.");

            }
            else
                alert("Debe ingresar una cuenta valida.");

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