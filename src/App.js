import React, { Component } from "react";
import Panel from "./Panel";
import getWeb3 from "../services/getWeb3";
import BEVContract from "../services/bev";
import {BEVService} from "../services/bevService";
import { ToastContainer } from "react-toastr";

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
            network: 'Ganache',
            contract: 0,
            account: undefined,
            balance: 0,
            elections: []
        };
    }

    // despues de que se cargo el componente
    async componentDidMount() {
        this.web3 = await getWeb3();
        console.log("Versión web3: " + this.web3.version);

        // Funcion para convertir a ether
        this.toEther = converter(this.web3);

        // Instancia de la BEV
        this.BEV = await BEVContract(this.web3.currentProvider);
        this.BEVService = new BEVService(this.BEV);
        this.setState({
            contract: this.BEV.contract.address
        });
        
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

    // Obtento el balance de la cuenta
    async getBalance(){
        let weiBalance = await this.web3.eth.getBalance(this.state.account);
        this.setState({
            balance: this.toEther(weiBalance)
        });
    }

    // Obtengo las elecciones en las que esta incluida la cuenta
    async getElections() {
        //let elections = await this.BEVService.getElectionsByAccount(this.state.account);
        let elections = await this.BEVService.getElections();
        this.setState({
            elections
        });
    }

    async load(){
        this.getBalance();
        this.getElections();
    }

    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">Bienvenido al sistema de votación electronica en blockchain</h4>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Balance">
                        <p><strong>Account:</strong> {this.state.account}</p>
                        <span><strong>Balance:</strong> {this.state.balance} eth</span>
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Contract instance">
                        <p><strong>Network:</strong> {this.state.network}</p>
                        <span><strong>Address:</strong> {this.state.contract}</span>
                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Elecciones disponibles">
                        <table>
                            <tbody>
                                <tr>
                                    <th>Nº</th>
                                    <th>Descripcion</th>
                                    <th>Estado</th>
                                    <th>Candidatos</th>
                                    <th>Votantes</th>
                                </tr>
                        {this.state.elections.map((election, i) => {
                            return  <tr key={i}>
                                        <td>{election.id.toNumber()}</td>
                                        <td>{election.name}</td>
                                        <td>{election.active.toString()}</td>
                                        <td>{election.candidatesCount.toNumber()}</td>
                                        <td>{election.votersCount.toNumber()}</td>
                                        <td><button className="btn btn-sm btn-success text-white" onClick ={ () => alert("Eleccion: " + election.name)} >Ver</button></td>
                                    </tr>
                        })}
                        </tbody>
                        </table>
                    </Panel>
                </div>
            </div>
            <ToastContainer ref={(input) => this.container = input}
                    className="toast-top-right"/>        
            </React.Fragment>
    }
}