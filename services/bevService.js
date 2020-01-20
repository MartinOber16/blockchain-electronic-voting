export class BEVService {

    constructor(contract) {
        this.contract = contract;
    }

    // Información del contrato
    async getContractBalance(){
        let contractBalance = (await this.contract.getContractBalance()).toNumber();
        return contractBalance; 
    }

    async getTotalElections() {
        let total = (await this.contract.getTotalElections()).toNumber();
        return total;
    }

    async getContractInfo() {
        return {
            address: this.contract.address,
            totalElections: await this.contract.getTotalElections(),
            balance: await this.contract.getContractBalance()
        }
    }

    // Información de una cuenta
    async isAdmin(addr) {
        let isUserAdmin = await this.contract.admins(addr);
        return isUserAdmin;
    }

    // Listado de elecciones
    mapElection(elections) {
        console.log(elections);
        return elections.map(election => {
            return {
                id: election[0].toNumber(),
                name: election[1],
                active: election[2].toString(),
                candidatesCount: election[3].toNumber(),
                votersCount: election[4].toNumber()
            }
        })
    }

    async getElections() {
        let total = await this.getTotalElections();
        let elections = [];        
        for(var i = 1; i <= total; i++) {            
            let election = await this.contract.getElection(i);
            elections.push(election);
        }
        return this.mapElection(elections);
    }

    // Ver una elección
    async getElection(id) {        
        let elections = [];            
        let election = await this.contract.getElection(id);
        elections.push(election);
        return this.mapElection(elections);
    }

    // Comprobar las elecciones en las que esta incluida la cuenta
    async getElectionsByAccount(account) {
        console.log("getElectionsByAccount");
        let total = await this.getTotalElections();
        let elections = [];        
        for(var i = 1; i <= total; i++) {
            if(await this.contract.voterIsJoined(i, account)) {
                let election = await this.contract.getElection(i);
                elections.push(election);
            }
        }
        return this.mapElection(elections);
    }

    // Agregar nueva elección
    async addElection(name, account, valueElection) {
        let transactionInfo;
        await this.contract.addElection(name, { from: account, value: valueElection }).then((receipt) => {
            transactionInfo = receipt;
            });
        return transactionInfo;
    }

    // Eliminar una elección
    async deleteElection(id, account) {
        console.log("async deleteElection("+id+")");
        let transactionInfo;
        await this.contract.deleteElection(id, {from: account}).then((receipt) => {
            transactionInfo = receipt;
        });
        console.log(transactionInfo);
    }

    // Listado de candidatos
    mapCandidate(candidates) {
        return candidates.map(candidate => {
            return {
                election: candidate[0].toNumber(),
                id: candidate[1].toNumber(),
                name: candidate[2],                
                voteCount: candidate[3].toNumber()
            }
        })
    }

    async getCandidates() {
        let totalElections = await this.getTotalElections();
        let candidates = [];        
        for(var i = 1; i <= totalElections; i++) {    
            var totalCandidates = await this.contract.getCandidatesCount(i);
            for(var j = 1 ; j <= totalCandidates; j++) {
                let candidate = await this.contract.getCandidate(i,j);
                candidates.push(candidate);
            }
        }
        return this.mapCandidate(candidates);
    }

    // Ver un candidato
    async getCandidate(election, id) {        
        let candidates = [];            
        let candidate = await this.contract.getCandidate(election, id);
        candidates.push(candidate);
        return this.mapCandidate(candidates);
    }

    // Agregar nuevo candidato
    async addCandidate(election, name, account) {
        let transactionInfo;
        await this.contract.addCandidate(election, name, { from: account }).then((receipt) => {
            transactionInfo = receipt;
            });
        return transactionInfo;
    }

    // Eliminar un candidato
    async deleteCandidate(election, id, account) {        
        let transactionInfo;
        await this.contract.deleteCandidate(election, id, {from: account}).then((receipt) => {
            transactionInfo = receipt;
        });
        console.log(transactionInfo);
    }

    // Listado de votantes
    mapVoter(voters) {
        return voters.map(voter => {
            return {
                election: voter[0].toNumber(),
                address: voter[1],
                name: voter[2],                
                voted: voter[3].toString()
            }
        })
    }

    async getVoters() {
        let totalElections = await this.getTotalElections();
        let voters = [];        
        for(var i = 1; i <= totalElections; i++) {    
            var totalVoters = await this.contract.getVotersCount(i);
            for(var j = 1 ; j <= totalVoters; j++) {
                let addr = await this.contract.getAddressVoter(i,j);
                let voter = await this.contract.getVoter(i,addr);
                voters.push(voter);
            }
        }
        return this.mapVoter(voters);
    }

    // Ver un votante
    async getVoter(election, address) {        
        let voters = [];            
        let voter = await this.contract.getVoter(election, address);
        voters.push(voter);
        return this.mapVoter(voters);
    }

    // Agregar nuevo votante
    async addVoter(election, address, name, account) {
        let transactionInfo;
        await this.contract.addVoter(election, address, name, { from: account }).then((receipt) => {
            transactionInfo = receipt;
            });
        return transactionInfo;
    }

    // Eliminar un votante
    async deleteVoter(election, address, account) {        
        let transactionInfo;
        await this.contract.deleteVoter(election, address, {from: account}).then((receipt) => {
            transactionInfo = receipt;
        });
        console.log(transactionInfo);
    }

    // TODO: Votacion

    // TODO: Administradores

}