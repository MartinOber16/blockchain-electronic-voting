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

    // Agregar nueva elección
    async addElection(name, account, valueElection) {
        let transactionInfo;
        await this.contract.addElection(name, { from: account, value: valueElection }).then((receipt) => {
            transactionInfo = receipt;
            //console.log(receipt);
            //logTransaction(receipt.tx);
          });
        return transactionInfo;
    }



    // getById(id)
    async getElectionById(id) {        
        let elections = [];                
        let election = await this.contract.elections[id];
        elections.push(election);

        return this.mapElection(elections);
    }

    // getByAccount
    async getElectionsByAccount(account) {
        let total = await this.contract.electionsCount;
        let elections = [];        
        for(var i = 0; i < total; i++) {
            if(await voterIsJoined(i, account)) {
                let election = await this.contract.elections[i];
                elections.push(election);
            }
        }
        return this.mapElection(elections);
    }

}
