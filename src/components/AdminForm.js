import React from "react";
import { useFormik } from 'formik';

const AdminForm = (props) => {
    const formik = useFormik({
        initialValues: {
        adminAddress: '',
        },
        onSubmit: values => {
        //console.log(JSON.stringify(values, null, 2));
        console.log(values.adminAddress);
        console.log(props);
        
        console.log("Add Election");
        await props.BEVService.addAdmin(values.adminAddress, props.account).then((receipt)=>{
            console.log(receipt);
            values.adminAddress = "";
        });                
        },
    });
    return (
        <form onSubmit={formik.handleSubmit}>
        <label htmlFor="adminAddress">Name</label>
        <input className="form-control" placeholder="Enter address"
            id="adminAddress"
            name="adminAddress"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.adminAddress}
        />
        <br />
        <div className="modal-footer">
            <button type="submit" className="btn btn-success">Guardar</button>
        </div>
        </form>
    );
};

export default AdminForm;