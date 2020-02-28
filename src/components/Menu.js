import React from "react";

export default (props) => {

    if(props.admin) {
        return <div className="col-sm-2 bg-light text-dark" id="menu">            
                <div className="" id="image" >
                </div>
                <div className="">                                          
                    <ul className="nav flex-column nav-pills" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" data-toggle="pill" href="#home">Inicio</a>                                
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="pill" href="#elections">Mis elecciones</a>                                
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="pill" href="#adminElection">Administración</a>                                
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" data-toggle="pill" href="#support">Soporte</a>                                
                        </li>
                    </ul>                                            
                </div>
            </div>
    }
    else {
        return <div className="col-sm-2 bg-light text-dark" id="menu">            
            <div className="" id="image" >
            </div>
            <div className="">                                          
                <ul className="nav flex-column nav-pills" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" data-toggle="pill" href="#home">Inicio</a>                                
                    </li>
                    <li className="nav-item">
                            <a className="nav-link" data-toggle="pill" href="#elections">Mis elecciones</a>                                
                        </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="pill" href="#support">Soporte</a>                                
                    </li>
                </ul>                                            
            </div>
        </div>
    }

}