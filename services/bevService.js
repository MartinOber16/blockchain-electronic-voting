export class BEVService {
    constructor(contract) {
        this.contract = contract;
    }

    // ADMINS
    // get(id)
    // getAll()
    // new(model)
    // delete(id)

    // ELECTION
    // getAll()
    async getElections() {
        let total = await this.contract.electionsCount;
        let elections = [];        
        for(var i = 1; i <= total; i++) {            
            let election = await this.contract.getElection(i);
            elections.push(election);
        }
        return this.mapElection(elections);
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

    mapElection(elections) {
        return elections.map(election => {
            return {
                id: election[0],
                name: election[1],
                active: election[2],
                candidatesCount: election[3],
                votersCount: election[4]
            }
        })
    }

    // new(model)
    async newElection(name) {
        await this.contract.addElection(name);

        return await this.contract.electionsCount;
    }

    // delete(id)
    // setStatus(bool)
    // getResult(id)

    // CANDIDATE
    // get(id)
    // getAll()
    // new(model)
    // delete(id)

    // VOTER
    // get(id)
    // getAll()
    // new(model)
    // delete(id)

    // UTILS
    // Response JSON
    // Map ?

}
