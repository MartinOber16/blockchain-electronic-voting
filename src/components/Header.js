import React from "react";

export default (props) => {
   return <div className="jumbotron jumbotron bg-dark text-white">
        <div className="row">
        <div className="col-sm-1 pl-5">
            <img 
                src="https://ps.w.org/ethereum-wallet/assets/icon-256x256.png?rev=1945165" 
                alt="ethereum"
                width="128" 
                height="128"
            /> 
        </div>
            <div className="col-sm-9" id="title">
                <div className="text-center">
                    <h1>Blockchain Electronic Voting</h1>
                    <img 
                        src="https://www.aclu-ms.org/sites/default/files/styles/featured_image_580x386/public/field_image/aclu_2018_icons_voting_rights.png?itok=6bDt6KJq" 
                        alt="ethereum"
                        width="96" 
                        height="96"
                    />
                </div>
            </div>
            <div className="col-sm-2 text-info text-center pt-5" id="profile">
                <br/>
                <b>{props.name}</b>
            </div>
        </div>
    </div>  
}
