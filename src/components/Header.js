import React from "react";

export default (props) => {
   return <div className="jumbotron jumbotron-fluid bg-dark text-white">
        <div className="row">
            <div className="col-sm-8" id="title">
                <div className="container pl-4 text-center">
                    <h1 className="">Blockchain Electronic Voting (BEV)</h1>
                </div>
            </div>
            <div className="col-sm-4 text-info text-right pr-5" id="profile">
                <b>{props.name}</b>
                <p className="small">{props.account}</p>
            </div>
        </div>
    </div>  
}
