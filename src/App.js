import React, { Component } from "react";
import Panel from "./Panel";
import getWeb3 from "../services/getWeb3";
import BEVContract from "../services/bev";
import {BEVService} from "../services/bevService";
import { ToastContainer } from "react-toastr";
import { useFormik } from 'formik';

// Funcion para convertir de weis a ethers
const converter = (web3) => {
    return (value) => {
        return web3.utils.fromWei(value.toString(), 'ether');
    }
}

const valueElection = 1000000000000000000; // 1 ether

const ElectionForm = (props) => {
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
        electionName: '',
        },
        onSubmit: values => {
        //console.log(JSON.stringify(values, null, 2));
        console.log(values.electionName);
        console.log(props);
        
        console.log("Add Election");
        let x = props.BEVService.addElection(values.electionName, props.account, valueElection);
        console.log(x);
        values.electionName = "";
        },
    });
    return (
        <form onSubmit={formik.handleSubmit}>
        <label htmlFor="electionName">Name</label>
        <input className="form-control" placeholder="Enter name"
            id="electionName"
            name="electionName"
            type="electionName"
            onChange={formik.handleChange}
            value={formik.values.electionName}
        />
        <br />
        <div className="modal-footer">
            <button type="submit" className="btn btn-success">Guardar</button>
        </div>
        </form>
    );
};

export class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            network: undefined,
            conected: false,
            contract: 0,
            totalElections: 0,
            contractBalance: 0,
            account: undefined,
            admin: false,
            name: undefined,
            accountBalance: 0,
            elections: []
        };
    }

    // Despues de que se carga el componente
    async componentDidMount() {        
        // Obtengo la versión 1 de web3
        this.web3 = await getWeb3();
        console.log("Versión web3: " + this.web3.version);
        

        // Funcion para convertir a ether
        this.toEther = converter(this.web3);

        // Instancia de la BEV
        try{
            this.BEV = await BEVContract(this.web3.currentProvider);
            this.BEVService = new BEVService(this.BEV);
        }
        catch(e) {
            console.log(e);
        }

        // Información del usuario actual
        var account = (await this.web3.eth.getAccounts())[0];
        //console.log("Cuenta actual: " + account);

        // Metodo de metamask para actualizar cuando hay cambio de cuenta
        this.web3.currentProvider.publicConfigStore.on('update', async function(event){
            this.setState({
                account: event.selectedAddress.toLowerCase()
            }, () => {
                this.load();
            });
        }.bind(this));

        // Guardo en el estado la información de la cuenta y cuando esta lista ejecuto la funcion load
        this.setState({
            account: account.toLowerCase()
        }, () => {
            this.load();
        } );
    }

    // Obtengo la información del contrato
    async getContractInfo() {
        let contractInfo = await this.BEVService.getContractInfo();
        //console.log(contractInfo);
        this.setState({
            network: 'Ganache',
            contract: contractInfo.address,
            totalElections: contractInfo.totalElections, 
            contractBalance: this.toEther(contractInfo.balance),
            conected: this.web3.currentProvider.isConnected() 
        });
    }

    // Obtengo la información del usuario actual
    async getUserInfo() {
        let weiBalance = await this.web3.eth.getBalance(this.state.account);
        if(this.state.conected) {
            let isAdmin = await this.BEVService.isAdmin(this.state.account);
            let name;
            if(isAdmin)
                name = "Administrador";
            else
                name = "Votante";

            this.setState({
                name: name,
                admin: isAdmin,
                accountBalance: this.toEther(weiBalance)
            });
        }
    }

    // Obtengo la información si la aplacacción esta conectada
    isConectedInfo() {
        if (this.state.conected) {
          return <span className="badge badge-success">Conectado</span>;
        }

        return <span className="badge badge-danger">Desconectado</span>;
    }

    // Obtengo todas las elecciones
    async getElections() {
        if(this.state.conected) {
            let allElections = await this.BEVService.getElections();
            console.log(allElections);
            this.setState({
                elections: allElections
            });
        }
    }

    // Genero los registros con los datos de las elecciones
    renderTableDataElections() {
        return this.state.elections.map((election   ) => {
           const { id, name, active, candidatesCount, votersCount } = election //destructuring
           return (
              <tr key={id}>
                 <td>{id}</td>
                 <td>{name}</td>
                 <td>{active}</td>
                 <td>{candidatesCount}</td>
                 <td>{votersCount}</td>
                 <td>
                    <button type="button" className="btn btn-info" onClick={async () => {await this.getElection(1);}} >Ver</button> 
                    <button type="button" className="btn btn-danger" onClick={async () => {await this.deleteElection(1);}} >Eliminar</button>
                </td>
              </tr>
           )
        })
     }

    // TODO: Obtener datos del formulario y mostrar el comprobante 
    async getElection(id) {
        console.log("Get Election");
        let election = await this.BEVService.getElectionById(id);
        console.log(election[0]);
    }

    async addElection(name){
        console.log("Add Election");
        let x = await this.BEVService.addElection(name, this.state.account, valueElection);
        console.log(x);
    }

    // TODO: No anda muy bien el eliminar, ver si es necesario o quizas una baja logica...
    async deleteElection(id) {
        console.log("Delete Election: " + id);
        let x = await this.BEVService.deleteElection(id, this.state.account);
        console.log(x);
    }

    async load(){
        await this.getContractInfo();
        await this.getUserInfo();
        await this.getElections();
    }

    render() {
        return <React.Fragment>
            <div className="jumbotron jumbotron-fluid bg-dark text-white">
                <div className="row">
                    <div className="col-sm-8" id="title">
                        <div className="container pl-4 text-center">
                            <h1 className="">Blockchain Electronic Voting (BEV)</h1>
                        </div>
                    </div>
                    <div className="col-sm-4 text-info text-right pr-5" id="profile">
                        <b>{this.state.name}</b>
                        <p className="small">{this.state.account}</p>
                    </div>
                </div>
            </div>  

            <div className="container row">
                <div className="col-sm-2 bg-light text-dark" id="menu">            
                    <div className="" id="image" >
                    </div>
                    <div className="">                                          
                        <ul className="nav flex-column nav-pills" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" data-toggle="pill" href="#home">Inicio</a>                                
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="pill" href="#listElection">Elecciones</a>                                
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="pill" href="#listCandidate">Candidatos</a>                            
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="pill" href="#listVoter">Votantes</a>                                
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="pill" href="#support">Soporte</a>                                
                            </li>
                        </ul>                                            
                    </div>
                </div>

                <div className="container-fluid pl-4 col-sm-10" id="content">

                    <div className="container tab-content">

                        <div id="home" className="container tab-pane active">
                            <div className="text-left mb-4" id="section">
                                <h3>Inicio</h3>                        
                            </div>
                            <div className="card bg-light text-dark" id="accountData">
                                <div className="card-body">
                                    <h5 className="card-title">Información de la cuenta</h5>
                                    <br/>
                                    <div className="card-text"><b>Cuenta:</b> {this.state.account}</div>
                                    <div className="card-text"><b>Balance:</b> {this.state.accountBalance} eth</div>
                                </div>
                            </div>
                            <br/>
                            <br/>
                            <div className="card bg-light text-dark" id="networkData">
                                <div className="card-body">
                                    <h5 className="card-title">Información de la red
                                        <div className="float-right">{this.isConectedInfo()}</div>
                                    </h5>    
                                    <br/>                         
                                    <div className="card-text"><b>Nombre de la red:</b> {this.state.network}</div>
                                    <div className="card-text"><b>Dirección del contrato:</b> {this.state.contract}</div>
                                    <div className="card-text"><b>Balance del contrato:</b> {this.state.contractBalance} eth</div>
                                </div>
                            </div> 
                        </div>

                        <div id="listElection" className="container tab-pane fade">
                            <div className="text-left mb-4" id="section">
                                <h3>Elecciones</h3>   
                            </div>
                            <div className="input-group row">  
                                <div className="input-group-append col-sm-1">
                                </div>                                          
                                <div className="input-group-append col-sm-8">   
                                    <input type="text" className="form-control" id="myInput" placeholder="Search" />                                                              
                                    <button className="btn btn-primary" type="submit">Clear</button>
                                </div>
                                <div className="btn-group col-sm-2">                                
                                    <button type="button" className="btn btn-success" 
                                    //data-toggle="modal" data-target="#myModal"
                                    >Nuevo</button>
                                </div>
                            </div>
                            <br/>

                            <table className="table border">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Número</th>
                                        <th>Nombre</th>
                                        <th>Estado</th>
                                        <th>Candidatos</th>
                                        <th>Votantes</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="myTable">
                                    {this.renderTableDataElections()}
                                </tbody>
                            </table>
                            <br/>

                            <div 
                                //className="modal" 
                                id="myModal"
                            >
                                <div className="modal-dialog">
                                    <div className="modal-content">

                                        <div className="modal-header">
                                            <h4 className="modal-title">Nuevo</h4>
                                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                                        </div>
                                        
                                        <div className="modal-body">
                                            <ElectionForm BEVService={this.BEVService} account={this.state.account}/>
                                        </div>
                                                                        
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div id="listCandidate" className="container tab-pane fade">
                            <div className="text-left mb-4" id="section">
                                <h3>Candidatos</h3>                
                            </div>                                           
                        </div>

                        <div id="listVoter" className="container tab-pane fade">
                            <div className="text-left mb-4" id="section">
                                <h3>Votantes</h3>                        
                            </div>                               
                        </div>

                        <div id="support" className="container tab-pane fade">
                            <div className="text-left mb-4" id="section">
                                <h3>Soporte</h3>                        
                            </div>
                            <div className="text-justify">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras varius, odio eget vulputate iaculis, tellus purus consequat purus, sit amet efficitur libero nulla ut purus. Nunc convallis sem eros, in bibendum metus tempor eget. Praesent eu enim sit amet sem consequat sagittis. Fusce sed fringilla dui, ut malesuada ante. Donec vel lectus id mauris faucibus feugiat. Curabitur varius purus feugiat leo aliquet, vitae tincidunt urna dictum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque posuere justo in purus tincidunt, nec sollicitudin sapien elementum. Duis sollicitudin, velit eget imperdiet vehicula, massa eros consequat sapien, id euismod nunc lectus non lacus.

                                    Suspendisse nisl ante, vestibulum vitae magna ac, cursus consectetur arcu. Cras consequat ex elit, feugiat rutrum odio pulvinar in. Donec tincidunt vestibulum dapibus. Sed eget risus malesuada tellus maximus sagittis. Suspendisse semper velit urna, nec laoreet nisl venenatis in. Nunc congue cursus congue. Vestibulum lobortis sapien ac aliquet posuere. Aliquam sollicitudin nunc ac ipsum varius, eget venenatis velit luctus. Sed faucibus odio sed tristique laoreet. Morbi at felis tempor, pretium augue nec, efficitur nibh.
                                    
                                    Curabitur tempor tincidunt tortor, sit amet faucibus lacus rutrum et. Nulla dignissim eros quis nulla venenatis, nec viverra purus viverra. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed vulputate ultrices faucibus. Donec volutpat rutrum nisi nec porttitor. Vestibulum ut aliquet sem.
                                    
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac convallis augue. Integer porta posuere enim, sit amet luctus nunc egestas id. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras euismod eget urna vitae scelerisque. Nunc sagittis eu risus malesuada semper. Curabitur in tellus pulvinar, ultrices velit in, finibus turpis. Nullam mollis interdum risus et faucibus. Vivamus vel nibh ligula. Pellentesque ut placerat nisi, at suscipit massa. Donec nisl est, suscipit ac ultrices eu, volutpat non erat. In hac habitasse platea dictumst.
                                    
                                    Aenean auctor lacus ut ipsum commodo commodo. Duis et efficitur nibh. Suspendisse lacinia lorem et felis feugiat consequat. Ut feugiat vulputate ligula eu cursus. Donec egestas lorem ac elit facilisis tristique. Maecenas ac lobortis dui. Mauris ligula orci, pulvinar eu lacinia non, auctor et sapien. Integer nec enim tortor. Maecenas condimentum, lacus laoreet aliquam pharetra, lacus leo lacinia ipsum, semper hendrerit tortor tellus a mauris. Ut malesuada ultricies magna, sit amet luctus elit porta pellentesque. Sed tristique placerat metus quis varius. Praesent fermentum viverra convallis.
                                </p>
                            </div>
                        </div>
                        <br/>
                        <br/>
                    </div>
                </div>
            </div>

            <ToastContainer ref={(input) => this.container = input} className="toast-top-right"/>        
            </React.Fragment>
    }
}