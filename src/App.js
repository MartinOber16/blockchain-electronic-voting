import React, { Component } from "react";
import getWeb3 from "../services/getWeb3";
import BEVContract from "../services/bev";
import { BEVService } from "../services/bevService";
import { ToastContainer } from "react-toastr";
import { useFormik } from 'formik';
import Header from "./components/Header";
import Menu from "./components/Menu";
import Soporte from "./components/Soporte";

// TODO: Mostrar información con Alertas o Modals
// TODO: Transferencia de los fondos del contrato
// TODO: Activar/Desactivar elección
// TODO: Prueba de usuario
// TODO: Manejar errores
// TODO: Optimizar formularios
// TODO: Alertas de Toast
// TODO: Optimizar codigo
// TODO: Componentes en React js

const valueElection = 1000000000000000000; // Valor a transferir para utilizar en la elección por costo para transacciones = 1 ether

// Funcion para convertir de weis a ethers
const converter = (web3) => {
    return (value) => {
        return web3.utils.fromWei(value.toString(), 'ether');
    }
}

// FORMULARIOS
const ElectionForm = (props) => {
    const formik = useFormik({
        initialValues: {
            electionName: "",
        },
        onSubmit: values => {   
            //console.log(JSON.stringify(values, null, 2));        
            //console.log("ElectionForm -> add Election(" + values.electionName + ", " + props.account + ", " + valueElection + ")");            
            let transactionInfo = props.BEVService.addElection(values.electionName, props.account, valueElection);
            //console.log("ElectionForm -> transactionInfo: " + transactionInfo);
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
            candidateName: "",
        },
        onSubmit: values => {
            //console.log(JSON.stringify(values, null, 2));
            //console.log("CandidateForm -> addCandidate(" + values.idElectionCandidate + ", " + values.candidateName + ", " + props.account + ")");               
            let transactionInfo = props.BEVService.addCandidate(values.idElectionCandidate, values.candidateName, props.account);
            //console.log("CandidateForm -> transactionInfo: " + transactionInfo);
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
            voterAddress: "",
            voterName: "",
        },
        onSubmit: values => {
            //console.log(JSON.stringify(values, null, 2));            
            //console.log("VoterForm -> addVoter(" + values.idElectionVoter + ", " + values.voterAddress + ", " + values.voterName + ", " + props.account + ")");
            let transactionInfo = props.BEVService.addVoter(values.idElectionVoter, values.voterAddress, values.voterName, props.account);
            //console.log("VoterForm -> transactionInfo: " + transactionInfo);
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

const VotingForm = (props) => {
    const formik = useFormik({
        initialValues: {
            electionIdVote: "",
            candidateVote: "",
        },
        onSubmit: values => {     
            //console.log(JSON.stringify(values, null, 2));                             
            //console.log("VotingForm -> voting(" + values.electionIdVote + ", " + values.candidateVote + ", " + props.account + ")");          
            let transactionInfo = props.BEVService.voting(values.electionIdVote, values.candidateVote, props.account);
            //console.log("VotingForm -> transactionInfo: " + transactionInfo);
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

        this.adminInput = React.createRef();
        this.clearTextAdminInput = this.clearTextAdminInput.bind(this);

        // TODO: Botón de limpiar no funciona correctamente
        this.electionInput = React.createRef();
        this.clearTextElectionInput = this.clearTextElectionInput.bind(this);
        this.candidateInput = React.createRef();
        this.clearTextCandidateInput = this.clearTextCandidateInput.bind(this);
        this.voterInput = React.createRef();
        this.clearTextVoterInput = this.clearTextVoterInput.bind(this);   
    }

    clearTextAdminInput(){
        //console.log("clearTextAdminInput");
        this.adminInput.current.value = "";
    }

    clearTextElectionInput(){
        //console.log("clearTextElectionInput");
        this.electionInput.current.value = "";
    }

    clearTextCandidateInput(){
        //console.log("clearTextCandidateInput");
        this.candidateInput.current.value = "";
    }

    clearTextVoterInput(){
        //console.log("clearTextVoterInput");
        this.voterInput.current.value = "";
    }

    // Despues de que se carga el componente
    async componentDidMount() {    
        console.log("componentDidMount");

        // Obtengo la versión 1 de web3
        this.web3 = await getWeb3();
        console.log("Versión web3: " + this.web3.version);
        
        // Funcion para convertir a ether
        this.toEther = converter(this.web3);

        // Instancia de la BEV
        try{
            this.BEV = await BEVContract(this.web3.currentProvider);
            console.log(this.BEV);
            this.BEVService = new BEVService(this.BEV);
            console.log(this.BEVService);
        }
        catch(e) {
            console.log(e);
        }

        // Información del usuario actual
        var account = (await this.web3.eth.getAccounts())[0];
        console.log("Cuenta actual: " + account);

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
        if(this.BEVService) {
            console.log("getContractInfo");
            let networkName = 'Ganache';
            let contractInfo = await this.BEVService.getContractInfo();
            console.log(contractInfo);
            this.setState({
                network: networkName,
                contract: contractInfo.address,
                totalElections: contractInfo.totalElections, 
                contractBalance: this.toEther(contractInfo.balance),
                conected: this.web3.currentProvider.isConnected() 
            });
        }
    }

    // Obtengo la información del usuario actual
    async getUserInfo() {
        if(this.state.conected) {
            console.log("getUserInfo");
            let weiBalance = await this.web3.eth.getBalance(this.state.account);
            console.log("weiBalance: " + weiBalance);
            let isAdmin = await this.isAdmin(this.state.account);
            let name;
            if(isAdmin)
                name = "Administrador";
            else
                name = "Usuario actual";

            this.setState({
                name: name,
                admin: isAdmin,
                accountBalance: this.toEther(weiBalance)
            });
        }
    }

    // Obtengo la información si la aplacacción esta conectada
    isConectedInfo() {
        console.log("Conected: " + this.state.conected);
        if (this.state.conected) {
          return <span className="badge badge-success">Conectado</span>;
        }

        return <span className="badge badge-danger">Desconectado</span>;
    }
    
    async isAdmin(address) {
        if(this.state.conected) {
            //console.log("isAdmin("+address+")");
            let isAdmin = await this.BEVService.isAdmin(address);
            console.log("Admin: " + isAdmin);
            return isAdmin;
        }
    }

    async addAdmin(address) {
        if(this.state.conected) {
            //console.log("addAdmin("+address+")");
            let transactionInfo = await this.BEVService.addAdmin(address, this.state.account);        
            //console.log(transactionInfo);
            return transactionInfo.tx;
        }
    }

    async deleteAdmin(address) {
        if(this.state.conected) {
            //console.log("deleteAdmin("+address+")");
            let transactionInfo = await this.BEVService.deleteAdmin(address, this.state.account);        
            //console.log(transactionInfo);
            return transactionInfo.tx;
        }
    }

    // Obtengo todas las elecciones
    async getElections() {
        if(this.state.conected) {
            //console.log("getElections");
            let allElections = await this.BEVService.getElections();
            //console.log(allElections);
            this.setState({
                elections: allElections
            });
        }
    }

    // Obtengo todas las elecciones de una cuenta
    async getElectionsByAccount() {
        if(this.state.conected) {
            //console.log("getElectionsByAccount");
            let electionsByAccount = await this.BEVService.getElectionsByAccount(this.state.account);
            //console.log(electionsByAccount);
            this.setState({
                electionsByAccount: electionsByAccount
            });
        }
    }

    // Obtengo una eleccion    
    async getElection(id) {
        if(this.state.conected) {
            //console.log("getElection("+id+")");
            let election = await this.BEVService.getElection(id);
            console.log(election[0]);        
            // return election[0];
        }
    }

    async deleteElection(id) {
        if(this.state.conected) {
            //console.log("deleteElection("+id+")");
            let transactionInfo = await this.BEVService.deleteElection(id, this.state.account);        
            console.log(transactionInfo);
            // return transactionInfo;
        }
    }

    // Obtengo todos los candidatos
    async getCandidates() {
        if(this.state.conected) {
            //console.log("getCandidates");
            let allCandidates = await this.BEVService.getCandidates();
            //console.log(allCandidates);
            this.setState({
                candidates: allCandidates
            });
        }
    }

    async getCandidate(election, id) {
        if(this.state.conected) {
            //console.log("getCandidate("+ election + ", " + id +")");      
            let candidate = await this.BEVService.getCandidate(election, id);
            console.log(candidate[0]);        
            // return candidate[0];
        }
    }
    
    async deleteCandidate(election, id) {
        if(this.state.conected) {
            //console.log("deleteCandidate("+ election + ", " + id +")");
            let transactionInfo = await this.BEVService.deleteCandidate(election, id, this.state.account);
            console.log(transactionInfo);
            // return transactionInfo;
        }        
    }

    // Obtengo todos los votantes
    async getVoters() {
        if(this.state.conected) {
            //console.log("getVoters");
            let allVoters = await this.BEVService.getVoters();
            //console.log(allVoters);
            this.setState({
                voters: allVoters
            });
        }
    }

    async getVoter(election, address) {
        if(this.state.conected) {
            //console.log("getVoter("+ election + ", " + address +")");
            let voter = await this.BEVService.getVoter(election, address);
            console.log(voter[0]);        
            // return voter[0];
        }
    }
    
    async deleteVoter(election, address) {
        if(this.state.conected) {
            //console.log("deleteVoter("+ election + ", " + address +")");
            let transactionInfo = await this.BEVService.deleteVoter(election, address, this.state.account);
            console.log(transactionInfo);
            // return transactionInfo;    
        }    
    }

    /*
    async voterHasVoted(election, address){
        console.log("voterHasVoted("+ election + ", " + address +")");
        let yaVoto = await this.BEVService.voterHasVoted(election, address);
        console.log(yaVoto);
        return yaVoto;
    }
    */

    // Comprobante de voto
    async getTransaction(election) {
        if(this.state.conected) {
            //console.log("getTransaction ->  election: " + election);
            let transaction = await this.BEVService.getTransaction(election, this.state.account);
            console.log(transaction);
            // return transaction;
        }
    }

    // TODO: Mostrar resultados de la elección
    async getResultElection(election) {
        if(this.state.conected) {
            //console.log("getResultElection -> election: " + election);
            let candidatoGanador = await this.BEVService.getResultElection(election);
            console.log(candidatoGanador[0]);        
            // return candidatoGanador;
        }
    }

    async getCandidatesByElection(election) {
        if(this.state.conected) {
            //console.log("getCandidatesByElection -> election: " + election);
            let candidatesByElection = await this.BEVService.getCandidatesByElection(election);
            console.log(candidatesByElection);
            // return candidatesByElection;
        }
    }

    // Genero los registros con los datos de las elecciones
    renderTableDataElections() {
        if(this.state.conected) {
            //console.log("renderTableDataElections");
            //console.log(this.state.elections);
            return this.state.elections.map((election) => {
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
     }

    // Genero los registros con los datos de los candidatos
    renderTableDataCandidates() {
        if(this.state.conected) {
            //console.log("renderTableDataCandidates");
            //console.log(this.state.candidates);
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
     }

    // Genero los registros con los datos de los votantes
    renderTableDataVoters() {
        if(this.state.conected) {
            //console.log("renderTableDataVoters");
            //console.log(this.state.voters);
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
     }
    
    // TODO: renderTableDataElectionsByAccount -> Habilitar los botones segun si ya voto
    renderTableDataElectionsByAccount() {
        if(this.state.conected) {
            //console.log("renderTableDataElectionsByAccount");
            //console.log(this.state.electionsByAccount);
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
                        <button type="button" className="btn btn-info" onClick={async () => {await this.getTransaction(id);}} >Comprobante</button>
                        <button type="button" className="btn btn-info" onClick={async () => {await this.getResultElection(id);}} >Resultados</button>
                    </td>
                </tr>
            )
            })
        }
     }
    
    async load(){
        console.log("load");
        await this.getContractInfo();
        await this.getUserInfo();
        await this.getElectionsByAccount();
    
        // Cargar la información según el perfil
        if(this.state.admin) {
            console.log("load admin");
            await this.getElections();
            await this.getCandidates();
            await this.getVoters();
        }
    }
    
    render() {
        return <React.Fragment>        
            <Header name={this.state.name} account={this.state.account}/> 

            <div className="container row">
            <Menu admin={this.state.admin}/>

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

                            <div id="adminUsers">
                                <h4>Administradores</h4>
                                <hr />
                                <div className="input-group row">                                           
                                    <div className="input-group-append col-sm-8">   
                                        <input ref = { this.adminInput } type="text" className="form-control" id="adminInput" placeholder="Buscar" />
                                        <button className="btn btn-primary" type="button" onClick={ this.clearTextAdminInput }>Limpiar</button>                                                        
                                    </div>
                                    <div className="btn-group col-sm-4">                                
                                        <button type="button" className="btn btn-info" onClick={
                                                                                                async () => {
                                                                                                    //console.log("Comprobar si es admin");
                                                                                                    let address = document.querySelector('#adminInput').value;
                                                                                                    //console.log("address: " + address);
                                                                                                    let result = await this.isAdmin(address); 
                                                                                                    //console.log("Result: " + result);
                                                                                                    document.querySelector('#adminResult').innerText = result;
                                                                                                    }
                                                                                                } >Comprobar</button> 
                                        <button type="button" className="btn btn-success" onClick={
                                                                                                async () => {
                                                                                                    //console.log("Agregar admin");
                                                                                                    let address = document.querySelector('#adminInput').value;
                                                                                                    //console.log("address: " + address);
                                                                                                    let result = await this.addAdmin(address); 
                                                                                                    //console.log("Result: " + result);
                                                                                                    document.querySelector('#adminResult').innerText = result;
                                                                                                    }
                                                                                                } >Agregar</button> 
                                        <button type="button" className="btn btn-danger" onClick={
                                                                                                async () => {
                                                                                                    //console.log("Eliminar admin");
                                                                                                    let address = document.querySelector('#adminInput').value;
                                                                                                    //console.log("address: " + address);
                                                                                                    let result = await this.deleteAdmin(address); 
                                                                                                    //console.log("Result: " + result);
                                                                                                    document.querySelector('#adminResult').innerText = result;
                                                                                                    }
                                                                                                } >Eliminar</button>
                                    </div>
                                </div>
                                <br />
                                <p id="adminResult"></p>
                            </div>
                            <br />

                            <div id="elections">
                                <h4>Elecciones</h4>
                                <hr />
                                <div className="input-group row">  
                                    <div className="input-group-append col-sm-1">
                                    </div>                                          
                                    <div className="input-group-append col-sm-8">   
                                        <input ref={ this.electionInput } type="text" className="form-control" id="electionInput" placeholder="Buscar" />                                                              
                                        <button className="btn btn-primary" type="button" onClick={ this.clearTextElectionInput }>Limpiar</button>
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
                                        <input ref={ this.candidateInput } type="text" className="form-control" id="candidateInput" placeholder="Buscar" />                                                              
                                        <button className="btn btn-primary" type="button" onClick={ this.clearTextCandidateInput }>Limpiar</button>
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
                                        <input ref= { this.voterInput } type="text" className="form-control" id="voterInput" placeholder="Buscar" />                                                              
                                        <button className="btn btn-primary" type="submit" onClick={ this.clearTextVoterInput }>Limpiar</button>
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
                            <Soporte />
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