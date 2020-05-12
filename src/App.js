import React, { Component } from "react";
import getWeb3 from "../services/getWeb3";
import BEVContract from "../services/bev";
import { BEVService } from "../services/bevService";
import {okCode, errorCode , networkName} from "../services/GlobalVariables";
import Header from "./components/Header";
import Menu from "./components/Menu";
import { Information } from "./components/Information";
import { ElectionsByAccountList } from "./components/ElectionsByAccountList";
import { AdminList } from "./components/AdminList";
import { ElectionList } from "./components/ElectionList";
import { CandidateList } from "./components/CandidateList";
import { VoterList }  from "./components/VoterList";
import { TransferList } from "./components/TransferList";
import Soporte from "./components/Soporte";
import { ToastContainer } from "react-toastr";
import swal from 'sweetalert';

// TODO: Mejorar la presentación de los resultados.
// TODO: Manejar errores de validación. Por ejemplo, no se puede eliminar una elección si tiene datos.
// TODO: Error con usuario que no es administrador. No afecta a la funcionalidad.

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
            network: undefined,    
            totalElections: 0,
            voters: []
        };
    }

    // Despues de que se carga el componente
    async componentDidMount() {
        try{
            this.web3 = await getWeb3(); // Obtengo la versión 1 de web3            
            this.toEther = converter(this.web3); // Funcion para convertir de wei a ether
            this.BEV = await BEVContract(this.web3.currentProvider); // Instancia del contrato  
            this.BEVService = new BEVService(this.BEV);
            ethereum.enable(); // Habilitar acceso a las cuentas en MetaMask
            ethereum.autoRefreshOnNetworkChange = false;
            var account = (await this.web3.eth.getAccounts())[0]; // Información del usuario actual

            // Metodo de metamask para actualizar cuando hay cambio de cuenta
            this.web3.currentProvider.publicConfigStore.on('update', async function(event){
                if(event.selectedAddress != null) {
                    this.setState({
                        account: event.selectedAddress.toLowerCase()
                    }, () => {
                        this.load();
                    });
                }
            }.bind(this));

            // Guardo en el estado la información de la cuenta y cuando esta lista ejecuto la funcion load
            if(account != undefined){
                this.setState({
                    account: account.toLowerCase()
                }, () => {
                    this.load();
                } );
            }

            // Subscribirse a un evento
            let votedEmited = this.BEV.VotedEvent();
            votedEmited.watch(function(err, result) {
                const {_account, _idElection} = result.args;

                if(_account == this.state.account) {
                    let msj = "Se emitio correctamente el voto para la elección: " + _idElection;
                    console.log(msj);
                    //this.container.success(msj,"Información",{closeButton: true, onClick: this.container.clear()});
                }
            }.bind(this));  

        }
        catch(e) {
            swal("Error obteniendo instancia del contrato.", e.toString(), "error");
            console.error(e);
        }
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
        if(this.BEVService) {            
            let contractInfo = await this.BEVService.getContractInfo();            
            this.setState({
                conected: this.web3.currentProvider.isConnected(),
                contractBalance: this.toEther(contractInfo.balance),
                contract: contractInfo.address,                
                network: networkName,        
                totalElections: contractInfo.totalElections
            });
        }
    }

    // Obtengo la información del usuario actual
    async getUserInfo() {
        if(this.state.conected) {            
            let weiBalance = await this.web3.eth.getBalance(this.state.account);
            let isAdmin = await this.isAdmin(this.state.account);
            let name;
            if(isAdmin)
                name = "Administrador";
            else
                name = "";

            this.setState({
                accountBalance: this.toEther(weiBalance),
                admin: isAdmin,
                name: name                                
            });
        }
    }

    // Obtengo todas las elecciones
    async getElections() {      
        await this.BEVService.getElections().then((receipt) => {
            if(receipt.status == okCode) {
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
        await this.BEVService.getCandidates().then((receipt) => {
            if(receipt.status == okCode) {
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
        await this.BEVService.getVoters(this.state.account).then((receipt) => {
            if(receipt.status == okCode) {
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
            if(receipt.status == okCode) {
                this.setState({
                    electionsByAccount: receipt.data
                });
            }                
        });     
    }

    async load(){
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
                            <Information 
                                BEVService={this.BEVService} 
                                state={this.state}
                            />
                            <br />
                        </div>
                        <div id="elections" className="container tab-pane fade">
                            <ElectionsByAccountList 
                                BEVService={this.BEVService} 
                                state={this.state} 
                            />
                            <br />
                        </div>
                        <div id="adminElection" className="container tab-pane fade">
                            <ElectionList 
                                BEVService={this.BEVService} 
                                state={this.state}
                                web3={this.web3}
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
                            <AdminList 
                                BEVService={this.BEVService} 
                                state={this.state}
                            />
                            <br /> 
                            <TransferList 
                                BEVService={this.BEVService} 
                                state={this.state}
                                web3={this.web3}
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