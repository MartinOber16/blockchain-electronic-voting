export class BEVService {

    constructor(contract) {
        this.contract = contract;
    }

    // TODO: probar la respuesta en formato JSON
    // Respuesta en formato JSON
    response(_status, _data){
        //var d = JSON.stringify(_data);
        var r = '{"status":'+_status+',"data":'+_data+'}'
        var o = JSON.parse(r);         
        return o;
    }

    // Información del contrato
    async getContractBalance(){
        let contractBalance = (await this.contract.getContractBalance()).toNumber();        
        return contractBalance;
        /*
        try{
            let contractBalance = (await this.contract.getContractBalance()).toNumber();                    
            return this.response(200, contractBalance);
        } catch(e) {
            console.error(e);
            return this.response(500, e);
        }*/        
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

    // Solo el propietario del contrato puede agregar o quitar administradores
    async addAdmin(address, account) {
        let transactionInfo;
        await this.contract.addAdmin(address, { from: account }).then((receipt) => {
            transactionInfo = receipt;
            });
        return transactionInfo;
    }

    async deleteAdmin(address, account) {
        console.log("bevService -> deleteAdmin");
        let transactionInfo;
        await this.contract.deleteAdmin(address, { from: account }).then((receipt) => {
            transactionInfo = receipt;
            });
        return transactionInfo;
    }

    // Listado de elecciones
    mapElection(elections) {        
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
        let total = await this.getTotalElections();
        let elections = [];        
        for(var i = 1; i <= total; i++) {
            if(await this.contract.voterIsJoined(i, account)) {
                let _yaVoto = await this.voterHasVoted(i, account);
                let e = await this.contract.getElection(i);                
                let election = {
                    id: e[0].toNumber(),
                    name: e[1],
                    active: e[2].toString(),
                    candidatesCount: e[3].toNumber(),
                    votersCount: e[4].toNumber(),
                    yaVoto: _yaVoto.toString()
                  };                                
                elections.push(election);
            }
        }
        return elections;
    }

    // Agregar nueva elección y devuelve la información de la transacción
    async addElection(name, account, valueElection) {
        let transactionInfo;
        await this.contract.addElection(name, { from: account, value: valueElection }).then((receipt) => {
            transactionInfo = receipt;
            });
        return transactionInfo;
    }

    // Eliminar una elección y devuelve la información de la transacción
    async deleteElection(id, account) {
        let transactionInfo;
        await this.contract.deleteElection(id, {from: account}).then((receipt) => {
            transactionInfo = receipt;
        });
        return transactionInfo;
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

    async getCandidatesByElection(election) {        
        var totalCandidates = await this.contract.getCandidatesCount(election);
        let candidates = [];                  
        for(var i = 1 ; i <= totalCandidates; i++) {
            let candidate = await this.contract.getCandidate(election,i);
            candidates.push(candidate);
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

    // Agregar nuevo candidato y devuelve la información de la transacción
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
        return transactionInfo;
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

    // Agregar nuevo votante y devuelve la información de la transacción
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
        return transactionInfo;
    }

    // Consulto si el usuario ya voto
    async voterHasVoted(election, account) {
        let yaVoto = await this.contract.voterHasVoted(election, account);        
        return yaVoto;
    }

    // Genera el voto, actualiza el numero de transacción y devuelve la información de la transaccion del voto
    async voting(election, candidate, account) {        
        let transactionInfo;
        await this.contract.voting(election, candidate, {from: account}).then((receipt) => {
            transactionInfo = receipt;
        });
        
        // TODO: addTransaction -> Ver si se puede integrar en el contrato.
        // No hace falta ya que en MetaMask se guardar los id de transacciones. Alcanzaria solo con mostrarlo
        await this.contract.addTransaction(election, transactionInfo.tx, {from: account}).then((receipt) => {
            console.log("Transaccion registrada!");
        });

        return transactionInfo;
    }
    
    // Obtengo la información de la transacción
    async getTransaction(election, account){
        let transaction = await this.contract.getTransaction(election, account);
        return transaction;
    }

    // Resultado de votación
    async getResultElection(election) {
        let ganador = await this.contract.getResultElection(election);
        let candidatoGanador = await this.getCandidate(election, ganador);
        return candidatoGanador;
    }
    
    // Transferencia de fondos del contrato
    async transferFromContract(address, etherToRefund, account) {
        let transactionInfo;
        await this.contract.transferFromContract(address, etherToRefund, {from: account}).then((receipt) => {
            transactionInfo = receipt;
        });
        return transactionInfo;
    }

}