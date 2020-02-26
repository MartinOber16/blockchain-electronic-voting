import React, { Component } from "react";
import getWeb3 from "../services/getWeb3";
import BEVContract from "../services/bev";
import { BEVService } from "../services/bevService";
import Header from "./components/Header";
import Menu from "./components/Menu";
import { Information } from "./components/Information";
import { ElectionsByAccountList } from "./components/ElectionsByAccountList";
import { AdminList } from "./components/AdminList";
import { ElectionList } from "./components/ElectionList";
import { CandidateList } from "./components/CandidateList";
import { VoterList }  from "./components/VoterList";
import Soporte from "./components/Soporte";
import { ToastContainer } from "react-toastr";

// TODO: Agregar funcionalidad par transferencia de los fondos del contrato
// TODO: Ver eventos
// TODO: Mostrar información con Alertas o Modals
// TODO: Optimizar codigo
// TODO: Pruebas
// TODO: Mejoras look&feel

// Funcion para convertir de weis a ethers
const converter = (web3) => {
    return (value) => {
        return web3.utils.fromWei(value.toString(), 'ether');
    }
}

export class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            account: undefined,
            admin: false,
            candidates: [],
            conected: false,
            contractBalance: 0,
            contract: 0,
            elections: [],
            electionsByAccount: [], 
            name: undefined,  
            network: 'Ganache',                
            totalElections: 0,
            voters: []
        };
    }

    // Despues de que se carga el componente
    async componentDidMount() {            
        this.web3 = await getWeb3(); // Obtengo la versión 1 de web3
        console.log("Versión web3: " + this.web3.version);
        
        this.toEther = converter(this.web3); // Funcion para convertir de wei a ether

        try{
            this.BEV = await BEVContract(this.web3.currentProvider); // Instancia del contrato  
            this.BEVService = new BEVService(this.BEV);
            ethereum.enable(); // Habilitar acceso a las cuentas en MetaMask
            ethereum.autoRefreshOnNetworkChange = false;
            var account = (await this.web3.eth.getAccounts())[0]; // Información del usuario actual
            console.log("Cuenta actual: " + account);
        }
        catch(e) {
            console.log("Error obteniendo instancia del contrato");
            console.error(e);
        }

        // TODO: Subscribirse a un evento
        let electionCreated = this.BEV.ElectionEvent();
        electionCreated.watch(function(err, result) {
            const {_idElection, _name} = result.args;
            let msj = "Se genero correctamente la elección: " + _name + ", ID: " + _idElection;
            console.log(msj);
            this.container.success(msj, "Información");
        }.bind(this));

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

    // Verifico si una cuenta es administador
    async isAdmin(address) {
        if(this.state.conected) {            
            let isAdmin = await this.BEVService.isAdmin(address);
            return isAdmin;
        }
    }

    // Obtengo la información del contrato
    async getContractInfo() {
        console.log('getContractInfo');
        if(this.BEVService) {            
            let contractInfo = await this.BEVService.getContractInfo();            
            this.setState({
                conected: this.web3.currentProvider.isConnected(),
                contractBalance: this.toEther(contractInfo.balance),
                contract: contractInfo.address,                
                network: 'Ganache',                
                totalElections: contractInfo.totalElections
            });
        }
    }

    // Obtengo la información del usuario actual
    async getUserInfo() {
        console.log('getUserInfo');
        if(this.state.conected) {            
            let weiBalance = await this.web3.eth.getBalance(this.state.account);
            let isAdmin = await this.isAdmin(this.state.account);
            let name;
            if(isAdmin)
                name = "Administrador";
            else
                name = "Cuenta";

            this.setState({
                accountBalance: this.toEther(weiBalance),
                admin: isAdmin,
                name: name                                
            });
        }
    }

    // Obtengo todas las elecciones
    async getElections() {    
        console.log('getElections');      
        await this.BEVService.getElections().then((receipt) => {
            if(receipt.status == 200) {
                this.setState({
                    elections: receipt.data
                });
            }
            else {
                this.setState({
                    elections: []
                });
            }
                               
        });
    }

    // Obtengo todos los candidatos
    async getCandidates() {     
        console.log('getCandidates');    
        await this.BEVService.getCandidates().then((receipt) => {
            if(receipt.status == 200) {
                this.setState({
                    candidates: receipt.data
                });
            }
            else {
                this.setState({
                    candidates: []
                });
            }
        });            
    }

    // Obtengo todos los votantes
    async getVoters() {  
        console.log('getVoters');   
        await this.BEVService.getVoters().then((receipt) => {
            if(receipt.status == 200) {
                this.setState({
                    voters: receipt.data
                });
            }
            else {
                this.setState({
                    voters: []
                });
            }
        });
    }

    // Obtengo todas las elecciones de una cuenta
    async getElectionsByAccount() {
        await this.BEVService.getElectionsByAccount(this.state.account).then((receipt) => {
            if(receipt.status == 200) {
                this.setState({
                    electionsByAccount: receipt.data
                });
            }                
        });     
    }

    async load(){
        console.log("load");
        await this.getContractInfo();
        await this.getUserInfo();
        await this.getElectionsByAccount();

        if(this.isAdmin) {
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
                            <Information 
                                BEVService={this.BEVService} 
                                state={this.state}
                            />
                            <br />
                            <ElectionsByAccountList 
                                BEVService={this.BEVService} 
                                state={this.state} 
                            />
                            <br />
                        </div>

                        <div id="adminElection" className="container tab-pane fade">
                            <div className="text-left mb-4" id="section">
                                <h3>Administración</h3>   
                                <hr />
                            </div>
                            <AdminList 
                                BEVService={this.BEVService} 
                                state={this.state}
                            />
                            <br />
                            <ElectionList 
                                BEVService={this.BEVService} 
                                state={this.state} 
                            />
                            <br />
                            <CandidateList 
                                BEVService={this.BEVService} 
                                state={this.state} 
                            />
                            <br />
                            <VoterList 
                                BEVService={this.BEVService} 
                                state={this.state} 
                            />
                            <br />                            
                        </div>

                        <div id="support" className="container tab-pane fade">
                            <Soporte />
                        </div>

                        <br/>
                    </div>
                </div>
            </div>  
            <ToastContainer ref={(input) => this.container = input}
                    className="toast-top-right"/>
        </React.Fragment>
    }
}