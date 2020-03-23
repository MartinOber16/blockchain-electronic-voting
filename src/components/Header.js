import React from "react";

export default (props) => {
   return <div className="jumbotron jumbotron bg-dark text-white">
        <div className="row">
        <div className="col-sm-2 pl-5">
            <img 
                src="https://ps.w.org/ethereum-wallet/assets/icon-256x256.png?rev=1945165" 
                alt="ethereum"
                width="128" 
                height="128"
            /> 
        </div>
            <div className="col-sm-8" id="title">
                <div className="text-center">
                    <h1>Blockchain Electronic Voting</h1>
                </div>
            </div>
            <div className="col-sm-2 text-info text-center pt-5" id="profile">
                <br/>
                <b>{props.name}</b>
            </div>
        </div>
    </div>  
}
