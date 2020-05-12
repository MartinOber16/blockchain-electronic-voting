pragma solidity ^0.4.24;

contract BEV {
    address private owner; // Propietario del contrato
    mapping(address => bool) public admins; // Lista de administradores

    // Estructura de candidato
    struct Candidate {
        uint id;
        string name;
        string description;
        uint voteCount;
    }

    // Estructura de votante
    struct Voter {
        string name;
        string description;
        bool voted;
    }

    // Estructura de elección
    struct Election {
        uint id;
        string name;
        string description;
        uint estado; // 0: "nueva", 1: "iniciada", 2: "finalizada"
        uint candidatesCount;// Almacenar el recuento de los candidatos
        uint votersCount; // Almacenar el recuento de los votantes
        uint candidatesIndex; // Indice de candidatos, ya que al eliminar no se borra el objeto
        uint votersIndex; // Indice de votanes, ya que al eliminar no se borra el objeto
        mapping(uint => Candidate) candidates; // Lectura/escritura de candidatos
        mapping(address => Voter) voters; // Lectura/escritura de los votantes
        mapping(address => bool) joinedVoters; // Almacenar cuentas que pueden votar
        mapping(uint => address) allVoters; // Lista de los votantes
    }

    mapping(uint => Election) private elections; // Lista de elecciones
    uint private electionsCount; // Almacenar el recuento de las elecciones
    uint private electionsIndex; // Indice de elecciones

    event VotedEvent(address indexed _account, uint _idElection); // evento de voto

    // Validar si es propietario
    modifier isOwner(){
        require(owner == msg.sender);
        _;
    }

    // Validar si es administrador
    modifier isAdmin(){
        require(admins[msg.sender]);
        _;
    }

    constructor () public {
        owner = msg.sender; // Quien publica el contrato es el dueño
        admins[msg.sender] = true; // Es administrador tambien
        electionsCount = 0;
        electionsIndex = 0;
    }

    // Agregar un administrador
    function addAdmin(address _addr) public isOwner {
        require(!admins[_addr], "addAdmin: Ya es administrador.");
        admins[_addr] = true;
    }

    // Quitar un administrador
    function deleteAdmin(address _addr) public isOwner {
        require(admins[_addr], "deleteAdmin: No es administrador.");
        admins[_addr] = false;
    }

    // Agregar una elección
    function addElection(string _name, string _description) public isAdmin payable {
        require(msg.value > 0 ether, "addElection: No hay suficientes ethers.");
        electionsCount++;
        electionsIndex++;
        elections[electionsIndex] = Election(electionsIndex, _name, _description, 0, 0, 0, 0, 0);
    }

    // Obtener detalles de una elección
    function getElection(uint _idElection) public view returns(uint, string, string, uint, uint, uint) {
        require(electionIsValid(_idElection), "getElection: Elección no valida");
        Election memory election = elections[_idElection];
        return (election.id, election.name, election.description, election.estado, election.candidatesCount, election.votersCount);
    }

    // Activar una elección
    function activeElection(uint _idElection) public isAdmin {
        require(electionIsValid(_idElection), "activeElection: Elección no valida");
        elections[_idElection].estado++;
    }

   // Eliminar una elección
    function deleteElection(uint _idElection) public isAdmin {
        require(electionIsValid(_idElection), "deleteElection: Elección no valida");
        require(elections[_idElection].votersCount == 0,"deleteElection: Hay votantes");
        require(elections[_idElection].candidatesCount == 0, "deleteElection: Hay candidatos");
        electionsCount--;
        delete elections[_idElection];
    }

    // Devuelve la cantidad de elecciones que hay en el contrato
    function getTotalElections() public view returns(uint) {
        return electionsCount;
    }

    function getElectionsIndex() public view returns(uint) {
        return electionsIndex;
    }

    // Comprobar si la eleccion es valida
    function electionIsValid(uint _idElection) private view returns(bool) {
        if(_idElection > 0 && _idElection <= electionsIndex)
            return true;

        return false;
    }

    // Agregar un candidato
    function addCandidate (uint _idElection, string _name, string _description) public isAdmin {
        require(electionIsValid(_idElection), "addCandidate: Elección no valida");
        require(elections[_idElection].estado == 0, "addCandidate: Estado no valido para agregar candidato");
        elections[_idElection].candidatesCount++;
        elections[_idElection].candidatesIndex++;
        elections[_idElection].candidates[elections[_idElection].candidatesIndex] = Candidate(elections[_idElection].candidatesIndex, _name, _description, 0);
    }

    // Obtener un candidato
    function getCandidate(uint _idElection, uint _idCandidate) public view returns(uint, uint, string, string, uint) {
        require(electionIsValid(_idElection), "getCandidate: Elección no valida");
        require(candidateIsValid(_idElection, _idCandidate), "getCandidate: Candidato no valido");
        Candidate memory candidate = elections[_idElection].candidates[_idCandidate];
        return (_idElection, candidate.id, candidate.name, candidate.description, candidate.voteCount);
    }

   // Eliminar un candidato
    function deleteCandidate(uint _idElection, uint _idCandidate) public isAdmin {
        require(electionIsValid(_idElection), "deleteCandidate: Elección no valida");
        require(candidateIsValid(_idElection, _idCandidate), "deleteCandidate: Candidato no valido");
        require(elections[_idElection].estado == 0, "deleteCandidate: Estado no valido para eliminar candidato");
        elections[_idElection].candidatesCount--;
        delete elections[_idElection].candidates[_idCandidate];
    }

    // Obtener la cantidad de candidatos de una elección
    function getCandidatesCount (uint _idElection) public view returns(uint){
        require(electionIsValid(_idElection), "getCandidateCount: Elección no valida");
        return elections[_idElection].candidatesCount;
    }

    function getCandidatesIndex (uint _idElection) public view returns(uint){
        require(electionIsValid(_idElection), "getCandidateIndex: Elección no valida");
        return elections[_idElection].candidatesIndex;
    }

    // Comprobar si el candidato es valido
    function candidateIsValid(uint _idElection, uint _idCandidate) private view returns(bool) {
        require(electionIsValid(_idElection), "candidateIsValid: Elección no valida");
        if(_idCandidate > 0 && _idCandidate <= elections[_idElection].candidatesIndex)
            return true;

        return false;
    }

    // Agregar un votante
    function addVoter (uint _idElection, address _addr, string _name, string _description, uint _amount) public isAdmin {
        require(electionIsValid(_idElection), "addVoter: Elección no valida");
        require(elections[_idElection].estado == 0, "addVoter: Estado no valido para agregar votante");
        elections[_idElection].votersCount++;
        elections[_idElection].votersIndex++;
        elections[_idElection].voters[_addr] = Voter(_name, _description, false);
        elections[_idElection].joinedVoters[_addr] = true;
        elections[_idElection].allVoters[elections[_idElection].votersIndex] = _addr;
        getEthersForVoting(_idElection, _addr, _amount);
    }

    // Comprobar si el votante esta en el padrón
    function voterIsJoined(uint _idElection, address _addr) public view returns(bool) {
        require(electionIsValid(_idElection), "voterIsJoined: Elección no valida");
        return elections[_idElection].joinedVoters[_addr];
    }

    // Obtengo la cuenta de un votante según su posición
    function getAddressVoter(uint _idElection, uint _index) public isAdmin view returns(address) {
        require(electionIsValid(_idElection), "getAddressVoter: Elección no valida");
        return elections[_idElection].allVoters[_index];
    }

    // Obtengo un votante
    function getVoter(uint _idElection, address _addr) public isAdmin view returns(uint, address, string, string, bool) {
        require(electionIsValid(_idElection), "getVoter: Elección no valida");
        //require(voterIsJoined(_idElection, _addr), "getVoter: Votante no valido");
        Voter memory voter = elections[_idElection].voters[_addr];
        return (_idElection, _addr, voter.name, voter.description, voter.voted);
    }

   // Eliminar votante
    function deleteVoter(uint _idElection, address _addr) public isAdmin {
        require(electionIsValid(_idElection), "deleteVoter: Elección no valida");
        require(voterIsJoined(_idElection, _addr),"deleteVoter: Votante no valido");
        require(!voterHasVoted(_idElection, _addr), "deleteVoter: Votante ya voto");
        require(elections[_idElection].estado == 0, "deleteVoter: Estado no valido para eliminar votante");
        elections[_idElection].joinedVoters[_addr] = false;
        delete elections[_idElection].voters[_addr];

        uint i = 0;
        bool encontro = false;
        while ((i <= elections[_idElection].votersCount) && !encontro){
            i++;
            if(elections[_idElection].allVoters[i] == _addr)
                encontro = true;

        }
       
        if(encontro)
            delete elections[_idElection].allVoters[i];

        elections[_idElection].votersCount--;
    }

    // Obtener la cantidad de votantes de la elección
    function getVotersCount (uint _idElection) public view returns(uint){
        require(electionIsValid(_idElection), "getVotersCount: Elección no valida");
        return elections[_idElection].votersCount;
    }

    function getVotersIndex (uint _idElection) public view returns(uint){
        require(electionIsValid(_idElection), "getVoterIndex: Elección no valida");
        return elections[_idElection].votersIndex;
    }

    // Votar
    function voting (uint _idElection, uint _idCandidate) public {
        require(electionIsValid(_idElection), "voting: Elección no valida"); // Requerir una elección válida
        // Exigir que sea un votante valido y que no haya votado antes
        require(elections[_idElection].estado == 1, "voting: Estado no valido para votar");
        require(voterIsJoined(_idElection, msg.sender), "voting: Votante no valido");
        require(!voterHasVoted(_idElection, msg.sender), "voting: Votante ya voto");
        require(candidateIsValid(_idElection, _idCandidate), "voting: Candidato no valido"); // Requerir un candidato válido
        elections[_idElection].voters[msg.sender].voted = true; // Registro de que el votante ha votado
        elections[_idElection].candidates[_idCandidate].voteCount++; // Registro de que el votante ha votado
        emit VotedEvent(msg.sender, _idElection); // Evento desencadenante del voto
    }

    // Comprobar si el votante ya voto
    function voterHasVoted(uint _idElection, address _addr) public view returns(bool) {
        require(electionIsValid(_idElection), "voterHasVoted: Elección no valida");
        require(voterIsJoined(_idElection, _addr), "voterHasVoted: Votante no valido");
        return elections[_idElection].voters[_addr].voted;
    }

    // Resultado de la votación
    function getResultElection(uint _idElection) public view returns(uint) {
        require(electionIsValid(_idElection), "getResultElection: Elección no valida");
        require(elections[_idElection].estado == 2, "getResultElection: Estado no valido para mostrar resultados");
        uint idGanadorActual = elections[_idElection].candidates[1].id;
        uint votosGanadorActual = elections[_idElection].candidates[1].voteCount;
        for(uint i = 2; i <= elections[_idElection].candidatesIndex; i++) {
            if(elections[_idElection].candidates[i].voteCount > votosGanadorActual) {
                idGanadorActual = elections[_idElection].candidates[i].id;
                votosGanadorActual = elections[_idElection].candidates[i].voteCount;
            }
            else {
                if(elections[_idElection].candidates[i].voteCount == votosGanadorActual)
                    idGanadorActual = 0;
            }
        }
        return idGanadorActual;
    }

    // Transferir etheres para poder votar
    function getEthersForVoting(uint _idElection, address _addr, uint monto) private isAdmin {
        require(voterIsJoined(_idElection, _addr), "getEthersForVoting: Votante no valido");
        require(getContractBalance() > monto, "getEthersForVoting: No hay ethers suficientes");
        _addr.transfer(monto);
    }

    // Transferir los fondos del contrato
    function transferFromContract(address _addr, uint _amount) public isAdmin {
        require(getContractBalance() > _amount, "transferFromContract: No hay ethers suficientes");
        _addr.transfer(_amount);
    }

    function transferToContract() public isAdmin payable {
        require(msg.value > 0 ether, "transferToContract: No hay suficientes ethers.");
    }

    // Obtener el balance del SmartContract
    function getContractBalance() public view returns (uint) {
        address BEVAddress = this;
        return BEVAddress.balance;
    }

}