import {okCode, errorCode, ethersForVoter} from "./GlobalVariables";

export class BEVService {

    constructor(contract) {
        this.contract = contract;
    }
    
    // Respuesta en formato JSON
    response(_status, _data){
        var d = JSON.stringify(_data);
        var r = '{"status":'+_status+',"data":'+ d +'}'
        var o = JSON.parse(r);         
        return o;
    }

    async getContractBalance(){
        let contractBalance = (await this.contract.getContractBalance()).toNumber();        
        return contractBalance;       
    }

    async getTotalElections() {
        let total = (await this.contract.getTotalElections()).toNumber();
        return total;
    }

    async getElectionsIndex() {
        let total = (await this.contract.getElectionsIndex()).toNumber();
        return total;
    }

    // Información del contrato
    async getContractInfo() {
        return {
            address: this.contract.address,
            totalElections: await this.getTotalElections(),
            balance: await this.contract.getContractBalance()
        }
    }

    // ADMINISTRADOR
    async isAdmin(addr) {
        let isUserAdmin = await this.contract.admins(addr);        
        return isUserAdmin;
    }
    
    async addAdmin(address, account) {
        let isUserAdmin = await this.isAdmin(address);
        if(isUserAdmin) {
            return this.response(errorCode, "El usuario ya es administrador.");
        }
        else {
            let transactionInfo;
            await this.contract.addAdmin(address, { from: account }).then((receipt) => {                
                transactionInfo = receipt;
                });
            return this.response(okCode, transactionInfo);
        }
    }

    async deleteAdmin(address, account) {
        let isUserAdmin = await this.isAdmin(address);
        if(!isUserAdmin) {
            return this.response(errorCode, "El usuario no es administrador");
        }
        else {
            let transactionInfo;
            await this.contract.deleteAdmin(address, { from: account }).then((receipt) => {
                transactionInfo = receipt;
                });
            return this.response(okCode, transactionInfo);
        }
    }

    // ELECCIÓN
    structElection(election) {
        return {
            id: election[0].toNumber(),
            name: election[1],
            description: election[2],
            estado: election[3].toNumber(),
            candidatesCount: election[4].toNumber(),
            votersCount: election[5].toNumber()
        }
    }

    // Listado de elecciones
    mapElection(elections) {        
        return elections.map(election => {
            return this.structElection(election);
        })
    }

    async getElections() {
        let totalElections = await this.getTotalElections();
        if(totalElections > 0) {
            let index = await this.getElectionsIndex();
            let elections = [];        
            for(var i = 1; i <= index; i++) {            
                let election = await this.contract.getElection(i);
                if(election[0]>0)
                    elections.push(election);
            }
            return this.response(okCode, this.mapElection(elections));
        }
        else
            return this.response(errorCode, "No hay elecciones.");

    }
    
    // Comprobar las elecciones en las que esta incluida la cuenta
    async getElectionsByAccount(account) {        
        let totalElections = await this.getTotalElections();
        if(totalElections > 0) {
            let index = await this.getElectionsIndex();
            let elections = [];        
            for(var i = 1; i <= index; i++) {
                if(await this.contract.voterIsJoined(i, account)) {
                    let _yaVoto = await this.voterHasVoted(i, account);
                    let e = await this.contract.getElection(i);
                    if(e[0]>0) {          
                        let election = {
                            id: e[0].toNumber(),
                            name: e[1],
                            description: e[2],
                            estado: e[3].toNumber(),
                            candidatesCount: e[4].toNumber(),
                            votersCount: e[5].toNumber(),
                            yaVoto: _yaVoto.toString()
                        };                
                        elections.push(election);
                    }
                }
            }
            return this.response(okCode, elections);
        }
        else 
            return this.response(errorCode, "No hay elecciones.");
    }

    // Ver una elección
    async getElection(id) {                  
        let election;
        await this.contract.getElection(id).then((receipt) => {
            election = this.structElection(receipt);
        });
        
        if(election != null)
            return this.response(okCode, election);
        else
            return this.response(errorCode, "No se pudo obtener la elección.");
    }

    // Agregar nueva elección y devuelve la información de la transacción
    async addElection(name, description, account, valueElection) {
        let transactionInfo;
        await this.contract.addElection(name, description, { from: account, value: valueElection }).then((receipt) => {
            transactionInfo = receipt;
            });
        
        if(transactionInfo != null)
            return this.response(okCode, transactionInfo);
        else
            return this.response(errorCode, "No se pudo agregar la nueva elección.");
    }

    // Eliminar una elección y devuelve la información de la transacción
    async deleteElection(id, account) {
        let transactionInfo;
        await this.contract.deleteElection(id, {from: account}).then((receipt) => {
            transactionInfo = receipt;
        });

        if(transactionInfo != null)
            return this.response(okCode, transactionInfo);
        else
            return this.response(errorCode, "No se pudo eliminar la elección.");
    }

    async activeElection(id, account) {
        let transactionInfo;
        await this.contract.activeElection(id, {from: account}).then((receipt) => {
            transactionInfo = receipt;
        });

        if(transactionInfo != null)
            return this.response(okCode, transactionInfo);
        else
            return this.response(errorCode, "No se pudo activar/desactivar la elección."); 

    }

    // CANDIDATO
    structCandidate(candidate) {
        return {
            election: candidate[0].toNumber(),
            id: candidate[1].toNumber(),
            name: candidate[2],
            description: candidate[3],                
            voteCount: candidate[4].toNumber()
        }
    }

    // Listado de candidatos
    mapCandidate(candidates) {
        return candidates.map(candidate => {
            return this.structCandidate(candidate);
        })
    }

    async getCandidates() {
        let totalElections = await this.getTotalElections();
        if(totalElections > 0) {
            let index = await this.getElectionsIndex();
            let candidates = [];        
            for(var i = 1; i <= index; i++) {    
                let totalCandidates = await this.contract.getCandidatesIndex(i);
                for(var j = 1 ; j <= totalCandidates; j++) {
                    let candidate = await this.contract.getCandidate(i,j);
                    if(candidate[1]>0)
                        candidates.push(candidate);
                }   
            }

            if(candidates.length > 0)
                return this.response(okCode, this.mapCandidate(candidates));
        }
            
        return this.response(errorCode, "No hay candidatos.");
    }

    // Ver un candidato
    async getCandidate(election, id) {                  
        let candidate;
        await this.contract.getCandidate(election, id).then((receipt) => {
            candidate = this.structCandidate(receipt);
        });
        
        if(candidate != null)
            return this.response(okCode, candidate);
        else
            return this.response(errorCode, "No se pudo obtener el candidato.");
    }

    // Agregar nuevo candidato y devuelve la información de la transacción
    async addCandidate(election, name, description, account) {
        let transactionInfo;
        await this.contract.addCandidate(election, name, description, { from: account }).then((receipt) => {
            transactionInfo = receipt;
            });
        
        if(transactionInfo != null)
            return this.response(okCode, transactionInfo);
        else
            return this.response(errorCode, "No se pudo agregar el candidato.");
    }

    // Eliminar un candidato
    async deleteCandidate(election, id, account) {        
        let transactionInfo;
        await this.contract.deleteCandidate(election, id, {from: account}).then((receipt) => {
            transactionInfo = receipt;
        });
        
        if(transactionInfo != null)
            return this.response(okCode, transactionInfo);
        else
            return this.response(errorCode, "No se pudo eliminar el candidato.");
    }

    // VOTANTE
    structVoter(voter){
        return {
            election: voter[0].toNumber(),
            address: voter[1],
            name: voter[2], 
            description: voter[3],               
            voted: voter[4].toString()
        }
    }

    // Listado de votantes
    mapVoter(voters) {
        return voters.map(voter => {
            return this.structVoter(voter);
        })
    }

    async getVoters(account) {
        let totalElections = await this.getTotalElections();
        if(totalElections > 0) {
            let index = await this.getElectionsIndex();
            let voters = [];        
            for(var i = 1; i <= index; i++) {    
                let totalVoters = (await this.contract.getVotersIndex(i)).toNumber();
                let addr = '0x';
                for(var j = 1 ; j <= totalVoters; j++) {
                    await this.contract.getAddressVoter(i, j, {from: account}).then((receipt)=> {
                        addr = receipt;
                    });

                    // Busco el votante por su dirección.
                    await this.contract.getVoter(i, addr, {from: account}).then((receipt) => {
                        let voter = receipt;
                        if(voter[2]!="")
                            voters.push(voter);
                    }); 
                }
            }
            
            if(voters.length > 0)
                return this.response(okCode, this.mapVoter(voters));
        }

        return this.response(errorCode, "No hay votantes.");
    }

    // Ver un votante
    async getVoter(election, address, account) {        
        let voter;            
        await this.contract.getVoter(election, address, { from: account }).then((receipt) => {
            voter = this.structVoter(receipt);
        });
        
        if(voter != null) 
            return this.response(okCode, voter);
        else
            return this.response(errorCode, "No se pudo obtener el votante.");
    }

    // Agregar nuevo votante y devuelve la información de la transacción
    async addVoter(election, address, name, description, account) {        
        let existe = await this.contract.voterIsJoined(election, address);
        if(existe){
            return this.response(errorCode, "El votante ya se encuentra registrado.");
        }
        else {
            let transactionInfo;
            await this.contract.addVoter(election, address, name, description, ethersForVoter, { from: account }).then((receipt) => {
                transactionInfo = receipt;
                });
    
            if(transactionInfo != null)
                return this.response(okCode, transactionInfo);
            else
                return this.response(errorCode, "No se pudo agregar el nuevo votante.");

        }
    }

    // Eliminar un votante
    async deleteVoter(election, address, account) {        
        let transactionInfo;
        await this.contract.deleteVoter(election, address, {from: account}).then((receipt) => {
            transactionInfo = receipt;
        });

        if(transactionInfo != null) 
            return this.response(okCode, transactionInfo);
        else
            return this.response(errorCode, "No se pudo eliminar el votante.");
    }

    // Consulto si el usuario ya voto
    async voterHasVoted(election, account) {
        let yaVoto = await this.contract.voterHasVoted(election, account);        
        return yaVoto;
    }

    // Genera el voto y devuelve la información de la transaccion del voto
    async voting(election, candidate, account) {  
        let yaVoto = await this.voterHasVoted(election, account);
        if(yaVoto)
            return this.response(errorCode, "El usuario ya voto.");
        else {
            let transactionInfo;
            await this.contract.voting(election, candidate, {from: account}).then((receipt) => {
                transactionInfo = receipt;
            });
    
            if(transactionInfo != null)
                return this.response(okCode, transactionInfo);
            else
                return this.response(errorCode, "No se pudo registrar el voto.");
        }
    }
    
    // Resultado de votación
    async getResultElection(election) {
        let id = await this.contract.getResultElection(election);
        let candidatoGanador;
        if(id > 0) {
            await this.contract.getCandidate(election, id).then((receipt) => {
                candidatoGanador = this.structCandidate(receipt);
            });
        }

        if(candidatoGanador != null)
            return this.response(okCode, candidatoGanador);
        else
            return this.response(errorCode, "No se puede determinar el candidato ganador.");
    }

    async getDetailsByElection(election) {  
        let totalCandidates = await this.contract.getCandidatesIndex(election);
        if(totalCandidates > 0) {
            let candidates = [];                  
            for(var i = 1 ; i <= totalCandidates; i++) {
                await this.contract.getCandidate(election,i).then((candidate) => {
                    if(candidate[1]>0)
                        candidates.push(candidate);
                });
            }
            return this.response(okCode, this.mapCandidate(candidates));
        }
        else
            return this.response(errorCode, "No hay candidatos."); 
    }
    
    // Transferencia de fondos del contrato
    async transferFromContract(toAddress, amount, account) {
        let transactionInfo;
        await this.contract.transferFromContract(toAddress, amount, {from: account}).then((receipt) => {
            transactionInfo = receipt;
        });

        if(transactionInfo != null)
            return this.response(okCode, transactionInfo);
        else
            return this.response(errorCode, "No se pudo realizar la transferencia.");
    }

    // Transferencia a el contrato
    async transferToContract(amount, account) {
        let transactionInfo;
        await this.contract.transferToContract({from: account, value: amount}).then((receipt) => {
            transactionInfo = receipt;
        });

        if(transactionInfo != null)
            return this.response(okCode, transactionInfo);
        else
            return this.response(errorCode, "No se pudo realizar la transferencia.");
    }

}