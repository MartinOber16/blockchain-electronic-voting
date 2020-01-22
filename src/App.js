import React, { Component } from "react";
import getWeb3 from "../services/getWeb3";
import BEVContract from "../services/bev";
import { BEVService } from "../services/bevService";
import { ToastContainer } from "react-toastr";
import { useFormik } from 'formik';

// TODO: Organizar logs
// TODO: Optimizar codigo
// TODO: Manejar errores

const valueElection = 1000000000000000000; // 1 ether

// Funcion para convertir de weis a ethers
const converter = (web3) => {
    return (value) => {
        return web3.utils.fromWei(value.toString(), 'ether');
    }
}

// Formularios
const ElectionForm = (props) => {
    const formik = useFormik({
        initialValues: {
            electionName: '',
        },
        onSubmit: values => {           
            console.log("Add Election");
            console.log(props.BEVService);
            let transactionInfo = props.BEVService.addElection(values.electionName, props.account, valueElection);
            console.log(transactionInfo);
            values.electionName = "";
        },
    });
    return (
        <form onSubmit={formik.handleSubmit}>
        <label htmlFor="electionName">Nombre de la Elección</label>
        <input className="form-control" placeholder="Enter name"
            id="electionName"
            name="electionName"
            type="text"
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

const CandidateForm = (props) => {
    const formik = useFormik({
        initialValues: {
            idElectionCandidate: 0,
            candidateName: '',
        },
        onSubmit: values => {
            //console.log(JSON.stringify(values, null, 2));
            console.log(values.idElectionCandidate);
            console.log(values.candidateName);
            console.log(props);
            
            console.log("Add Candidate");
            let x = props.BEVService.addCandidate(values.idElectionCandidate, values.candidateName, props.account);
            console.log(x);
            values.idElectionCandidate = 0;
            values.candidateName = "";
        },
    });
    return (
        <form onSubmit={formik.handleSubmit}>
        <label htmlFor="idElectionCandidate">Nro de Elección</label>
        <input className="form-control" placeholder="Enter election"
            id="idElectionCandidate"
            name="idElectionCandidate"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.idElectionCandidate}
        />
        <label htmlFor="candidateName">Nombre del candidato</label>
        <input className="form-control" placeholder="Enter name"
            id="candidateName"
            name="candidateName"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.candidateName}
        />
        <br />
        <div className="modal-footer">
            <button type="submit" className="btn btn-success">Guardar</button>
        </div>
        </form>
    );
};

const VoterForm = (props) => {
    const formik = useFormik({
        initialValues: {
            idElectionVoter: 0,
            voterAddress: '',
            voterName: '',
        },
        onSubmit: values => {
            //console.log(JSON.stringify(values, null, 2));
            console.log(values.idElectionVoter);
            console.log(values.voterAddress);
            console.log(values.voterName);
            console.log(props);
            
            console.log("Add Voter");
            let x = props.BEVService.addVoter(values.idElectionVoter, values.voterAddress, values.voterName, props.account);
            console.log(x);
            values.idElectionVoter = 0;
            values.voterAddress = "";
            values.voterName = "";
        },
    });
    return (
        <form onSubmit={formik.handleSubmit}>
        <label htmlFor="idElectionVoter">Nro de Elección</label>
        <input className="form-control" placeholder="Enter election"
            id="idElectionVoter"
            name="idElectionVoter"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.idElectionVoter}
        />
        <label htmlFor="voterAddress">Cuenta del Votante</label>
        <input className="form-control" placeholder="Enter address"
            id="voterAddress"
            name="voterAddress"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.voterAddress}
        />
        <label htmlFor="voterName">Nombre del Votante</label>
        <input className="form-control" placeholder="Enter name"
            id="voterName"
            name="voterName"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.voterName}
        />
        <br />
        <div className="modal-footer">
            <button type="submit" className="btn btn-success">Guardar</button>
        </div>
        </form>
    );
};

// TODO: Proceso de votación
const VotingForm = (props) => {
    const formik = useFormik({
        initialValues: {
            electionIdVote: "",
            candidateVote: "",
        },
        onSubmit: values => {            
            console.log("Vote Election: " + values.electionIdVote + ", " + props.account + ", " + values.candidateVote);              
            let x = props.BEVService.voting(values.electionIdVote, values.candidateVote, props.account);
            console.log(x);
            values.electionIdVote = "";
            values.candidateVote = "";
        },
    });
    return (
        <form onSubmit={formik.handleSubmit}>
        <label htmlFor="electionIdVote">Elección</label>
        <input className="form-control" placeholder="Enter electionIdVote"
            id="electionIdVote"
            name="electionIdVote"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.electionIdVote}
        />
        <label htmlFor="candidateVote">Candidato</label>
        <input className="form-control" placeholder="Enter candidate"
            id="candidateVote"
            name="candidateVote"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.candidateVote}
        />
        <br />
        <div className="modal-footer">
            <button type="submit" className="btn btn-success">Votar</button>
        </div>
        </form>
    );
};

// TODO: Administradores
const adminForm = (props) => {
    const formik = useFormik({
        initialValues: {
        adminAddress: '',
        },
        onSubmit: values => {
        //console.log(JSON.stringify(values, null, 2));
        console.log(values.adminAddress);
        console.log(props);
        
        console.log("Add Election");
        let x = props.BEVService.addAdmin(values.adminAddress, props.account);
        console.log(x);
        values.adminAddress = "";
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
            elections: [],
            electionsByAccount: [],
            candidates: [],
            voters: []
        };
    }

    // TODO: ver que funciones se pueden sacar de aca
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

    async getElectionsByAccount() {
        if(this.state.conected) {
            let electionsByAccount = await this.BEVService.getElectionsByAccount(this.state.account);
            console.log(electionsByAccount);
            this.setState({
                electionsByAccount: electionsByAccount
            });
        }
    }

    // Obtener comprobante de transacciones
    async getElection(id) {
        console.log("Get Election: " + id);
        let election = await this.BEVService.getElection(id);
        console.log(election[0]);
    }

    /*
    async addElection(name){
        console.log("Add Election");
        let x = await this.BEVService.addElection(name, this.state.account, valueElection);
        console.log(x);
    }
    */

    async deleteElection(id) {
        console.log("Delete Election: " + id);
        let x = await this.BEVService.deleteElection(id, this.state.account);
        console.log(x);
    }

    // Obtengo todos los candidatos
    async getCandidates() {
        if(this.state.conected) {
            let allCandidates = await this.BEVService.getCandidates();
            console.log(allCandidates);
            this.setState({
                candidates: allCandidates
            });
        }
    }

    async getCandidate(election, id) {
        console.log("Get Candidate election: " + election + " id: " + id);
        let candidate = await this.BEVService.getCandidate(election, id);
        console.log(candidate[0]);
    }

    /*
    async addCandidate(election, name){
        console.log("Add Candidate");
        let x = await this.BEVService.addCandidate(election, name, this.state.account);
        console.log(x);
    }*/
    
    async deleteCandidate(election, id) {
        console.log("Delete Candidate: " + id);
        let x = await this.BEVService.deleteCandidate(election, id, this.state.account);
        console.log(x);
    }

    // Obtengo todos los votantes
    async getVoters() {
        if(this.state.conected) {
            let allVoters = await this.BEVService.getVoters();
            console.log(allVoters);
            this.setState({
                voters: allVoters
            });
        }
    }

    async getVoter(election, address) {
        console.log("Get Voter: " + address);
        let voter = await this.BEVService.getVoter(election, address);
        console.log(voter[0]);
    }
    /*
    async addVoter(election, address, name){
        console.log("Add Voter");
        let x = await this.BEVService.addVoter(election, address, name, this.state.account);
        console.log(x);
    }
    */
    
    async deleteVoter(election, address) {
        console.log("Delete Voter: " + address);
        let x = await this.BEVService.deleteVoter(election, address, this.state.account);
        console.log(x);
    }

    async voterHasVoted(election, address){
        console.log("voterHasVoted: " + election + ", " + address);
        let yaVoto = await this.BEVService.voterHasVoted(election, address);
        console.log(yaVoto);
        return yaVoto;
    }
    /*
    async voting(election, candidate){
        console.log("Voting");
        let x = await this.BEVService.voting(election, candidate, this.state.account);
        console.log(x);
        let t = await this.BEVService.getTransaction(election, this.state.account);
        console.log("Transaction: " + t);
    }
    */

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
                    <button type="button" className="btn btn-info" onClick={async () => {await this.getElection(id);}} >Ver</button> 
                    <button type="button" className="btn btn-danger" onClick={async () => {await this.deleteElection(id);}} >Eliminar</button>
                </td>
              </tr>
           )
        })
     }

    // Genero los registros con los datos de los candidatos
    renderTableDataCandidates() {
        return this.state.candidates.map((candidate, index ) => {
           const { election, id, name, voteCount } = candidate //destructuring
           return (
                <tr key={index}>
                    <td>{election}</td>
                    <td>{name}</td>
                    <td>{voteCount}</td>
                    <td>
                        <button type="button" className="btn btn-info" onClick={async () => {await this.getCandidate(election, id);}} >Ver</button> 
                        <button type="button" className="btn btn-danger" onClick={async () => {await this.deleteCandidate(election, id);}} >Eliminar</button>
                    </td>
                </tr>
           )
        })
     }

    // Genero los registros con los datos de los votantes
    renderTableDataVoters() {
        return this.state.voters.map((voter, index) => {
           const { election, address, name, voted } = voter //destructuring
           return (
              <tr key={index}>
                 <td>{election}</td>
                 <td>{address}</td>
                 <td>{name}</td>
                 <td>{voted}</td>
                 <td>
                    <button type="button" className="btn btn-info" onClick={async () => {await this.getVoter(election, address);}} >Ver</button> 
                    <button type="button" className="btn btn-danger" onClick={async () => {await this.deleteVoter(election, address);}} >Eliminar</button>
                </td>
              </tr>
           )
        })
     }

    // TODO: Habilitar los botones segun si ya voto
    // TODO: Modal para ver el comprobante de voto
    // TODO: Sección para ver los resultados de la elección
    renderTableDataElectionsByAccount() {
        return this.state.electionsByAccount.map((election   ) => {
           const { id, name, active, yaVoto } = election //destructuring
           return (
              <tr key={id}>
                 <td>{id}</td>
                 <td>{name}</td>
                 <td>{active}</td>
                 <td>{yaVoto}</td>
                 <td>
                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#electionByAccountModal">Votar</button>
                    <button type="button" className="btn btn-info" onClick={async () => {await this.getElection(id);}} >Resultados</button> 
                </td>
              </tr>
           )
        })
     }

    // TODO: ver de cargar la información según el perfil
    async load(){
        await this.getContractInfo();
        await this.getUserInfo();
        await this.getElectionsByAccount();
        console.log("Is admin: " + this.state.admin);
        if(this.state.admin) {
            await this.getElections();
            await this.getCandidates();
            await this.getVoters();
        }
    }

    // TODO: Mostrar opciones del menú segun el perfil
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
                                <a className="nav-link" data-toggle="pill" href="#adminElection">Administrar Elecciones</a>                                
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
                                <hr />                  
                            </div>
                            <div className="row">
                                <div className="card bg-light text-dark col-sm-6" id="accountData">
                                    <div className="card-body">
                                        <h5 className="card-title">Información de la cuenta</h5>
                                        <hr />
                                        <div className="card-text"><b>Cuenta:</b> {this.state.account}</div>
                                        <div className="card-text"><b>Balance:</b> {this.state.accountBalance} eth</div>
                                    </div>
                                </div>
                                <div className="card bg-light text-dark col-sm-6" id="networkData">
                                    <div className="card-body">
                                        <h5 className="card-title">Información de la red
                                            <div className="float-right">{this.isConectedInfo()}</div>
                                        </h5>    
                                        <hr />                         
                                        <div className="card-text"><b>Nombre de la red:</b> {this.state.network}</div>
                                        <div className="card-text"><b>Dirección del contrato:</b> {this.state.contract}</div>
                                        <div className="card-text"><b>Balance del contrato:</b> {this.state.contractBalance} eth</div>
                                    </div>
                                </div> 
                            </div>
                            <br/>
                            <br />
                            <div id="electionsByAccount">
                                <h3>Elecciones</h3>
                                <hr />
                                <br/>         
                                <table className="table border">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>Número</th>
                                            <th>Nombre</th>
                                            <th>Estado</th>
                                            <th>Ya Voto</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="electionTableByAccount">
                                        {this.renderTableDataElectionsByAccount()}
                                    </tbody>
                                </table>
                                <br/>
                                <div className="modal" id="electionByAccountModal">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h4 className="modal-title">Votar</h4>
                                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                            </div>                                        
                                            <div className="modal-body">
                                                <VotingForm BEVService={this.BEVService} account={this.state.account}/>
                                            </div>                                                                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />
                        </div>

                        <div id="adminElection" className="container tab-pane fade">
                            <div className="text-left mb-4" id="section">
                                <h3>Administración</h3>   
                                <hr />
                            </div>
                            <div id="elections">
                                <h4>Elecciones</h4>
                                <hr />
                                <div className="input-group row">  
                                    <div className="input-group-append col-sm-1">
                                    </div>                                          
                                    <div className="input-group-append col-sm-8">   
                                        <input type="text" className="form-control" id="electionInput" placeholder="Buscar" />                                                              
                                        <button className="btn btn-primary" type="submit">Limpiar</button>
                                    </div>
                                    <div className="btn-group col-sm-2">                                
                                        <button type="button" className="btn btn-success" data-toggle="modal" data-target="#electionModal">Nueva</button>
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
                                    <tbody id="electionTable">
                                        {this.renderTableDataElections()}
                                    </tbody>
                                </table>
                                <br/>
                                <div className="modal" id="electionModal">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h4 className="modal-title">Nueva Elección</h4>
                                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                            </div>                                        
                                            <div className="modal-body">
                                                <ElectionForm BEVService={this.BEVService} account={this.state.account}/>
                                            </div>                                                                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />
                            
                            <div id="candidates">
                                <h4>Candidatos</h4>
                                <hr />
                                <div className="input-group row">  
                                    <div className="input-group-append col-sm-1">
                                    </div>                                          
                                    <div className="input-group-append col-sm-8">   
                                        <input type="text" className="form-control" id="candidateInput" placeholder="Buscar" />                                                              
                                        <button className="btn btn-primary" type="submit">Limpiar</button>
                                    </div>
                                    <div className="btn-group col-sm-2">                                
                                        <button type="button" className="btn btn-success" data-toggle="modal" data-target="#candidateModal">Nuevo</button>
                                    </div>
                                </div>
                                <br/>                    
                                <table className="table border">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>Elección</th>
                                            <th>Nombre</th>
                                            <th>Votos</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="candidateTable">
                                        {this.renderTableDataCandidates()}
                                    </tbody>
                                </table>
                                <br/>
                                <div className="modal" id="candidateModal">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h4 className="modal-title">Nuevo Candidato</h4>
                                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                            </div>                                        
                                            <div className="modal-body">
                                                <CandidateForm BEVService={this.BEVService} account={this.state.account}/>
                                            </div>                                                                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />

                            <div id="voters">
                                <h4>Votantes</h4>
                                <hr />
                                <div className="input-group row">  
                                    <div className="input-group-append col-sm-1">
                                    </div>                                          
                                    <div className="input-group-append col-sm-8">   
                                        <input type="text" className="form-control" id="voterInput" placeholder="Buscar" />                                                              
                                        <button className="btn btn-primary" type="submit">Limpiar</button>
                                    </div>
                                    <div className="btn-group col-sm-2">                                
                                        <button type="button" className="btn btn-success" data-toggle="modal" data-target="#voterModal">Nuevo</button>
                                    </div>
                                </div>
                                <br/>                  
                                <table className="table border">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>Elección</th>
                                            <th>Cuenta</th>
                                            <th>Nombre</th>
                                            <th>Ya voto</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="voterTable">
                                        {this.renderTableDataVoters()}
                                    </tbody>
                                </table>
                                <br/>
                                <div className="modal" id="voterModal">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h4 className="modal-title">Nuevo Votante</h4>
                                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                            </div>                                        
                                            <div className="modal-body">
                                                <VoterForm BEVService={this.BEVService} account={this.state.account}/>
                                            </div>                                                                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />

                        </div>

                        <div id="support" className="container tab-pane fade">
                            <div className="text-left mb-4" id="section">
                                <h3>Soporte</h3>
                                <hr />                    
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