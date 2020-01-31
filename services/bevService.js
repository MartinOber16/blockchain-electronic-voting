export class BEVService {

    constructor(contract) {
        this.contract = contract;
    }

/*
    200 OK: todo se ha procesado de forma correcta.
    201 Created: la petición se ha procesado y como resultado se ha creado un nuevo recurso.
    202 Accepted: la petición ha sido aceptada pero todavía no se ha completado.
    203 Non-Authoritative Information: indica que la petición se ha completado, pero se ha obtenido el recurso de otro servidor.
    204 No Content: la petición se ha procesado con éxito, pero el resultado está vacío.
    205 Reset Content: igual que el anterior, pero indicando al navegador que debe inicializar la página desde la que se realizó la petición.
    206 Partial Content: se está devolviendo el contenido pedido de forma parcial. Útil para reanudar descargas que se han pausado.
    207 Multi-Status: devuelve varias peticiones a la vez.
    208 Already Reported: ya se devolvió el listado de elementos, así que no se vuelve a listar.

    400 Bad Request: algo ha ido mal con la petición. Si recibes este error, prueba a refrescar la página o actualizar tu navegador.
    401 Unauthorized: no tienes permiso para recibir ese contenido.
    402 Payment Required: en desuso por ahora.
    403 Forbidden: la petición es correcta pero el servidor se niega a ofrecerte el recurso o página web. Es posible que necesites una cuenta en el servicio e iniciar sesión antes de poder acceder.
    404 Not Found: El código de estado más famoso de todos indica que el recurso no está disponible en el servidor. Quizá lo estuvo en el pasado y ha sido borrado o quizá has escrito la dirección web mal. Si recibes este error, comprueba que la dirección que has introducido es correcta y no le falta o sobra nada. También puedes insertar la dirección en Wayback Machine para ver si existió en el pasado.
    405 Method Not Allowed: no se permite el uso de ese método.
    406 Not Acceptable: la petición solo puede generar un tipo de contenido distinto al que se especificó como aceptable.
    407 Proxy Authentication Required: se requiere al cliente que se identifique mediante un proxy.
    408 Request Timeout: el servidor ha pasado demasiado tiempo esperando una respuesta por parte del cliente.
    409 Conflict: la petición no se pudo completar porque hubo un problema con ella.
    410 Gone: esa página no existe, se borró. Este código es usado por buscadores como Google, que usan la información para eliminar contenido de su base de datos.
    411 Length Required: el cliente debía indicar la longitud del contenido, pero no lo hizo.
    412 Precondition Failed: el servidor no cumple las condiciones previas que se indicaban en la petición.
    413 Payload Too Large: la petición es demasiado larga y el servidor se niega a procesarla.
    414 URI Too Long: la dirección web es demasiado larga. Si recibes este error, difícilmente podrás solucionarlo pues no es problema tuyo, sino de la página que generó dicho enlace.
    415 Unsupported Media Type: el tipo de archivo que se ha recibido es distinto al que se esperaba.
    416 Range Not Satisfiable: el cliente ha pedido una porción de un recurso que es incorrecta.
    417 Expectation Failed: el servidor no puede cumplir con las expectaciones de la cabecera.
    418 I'm a teapot: es un código de estado que nació como una broma de April's Fools. Puedes recibir uno visitando esta web.
    421 Misdirected Request: el servidor es incapaz de producir una respuesta.
    422 Unprocessable Entity: la petición era correcta pero tenía algún error semántico.
    423 Locked: este recurso está bloqueado.
    424 Failed Dependency: este recurso depende de otra respuesta, que falló.
    426 Upgrade Required: el cliente debe usar un protocolo distinto.
    428 Precondition Required: el servidor requiere que la petición sea condicional.
    429 Too Many Requests: se han enviado demasiadas peticiones en un corto período de tiempo.
    431 Request Header Fields Too Large: la cabecera o algunos de los campos de la cabecera son demeasiado grandes.
    452 Unavailable for Legal reasons: el servidor deniega el accceso a este recurso por motivos legales.

    500 Internal Server Error: Segundo en popularidad tras el error 404, el error 500 es un error genérico que indica que hay un problema en el servidor. No se especifica nada más concreto, de modo que el problema puede ser de cualquier tipo, desde que esté sobrecargado hasta que esté en ese momento realizando algunos cambios internos de modo que algo haya dejado de funcionar. Como usuario solo puedes esperar y probar de nuevo más tarde.
    501 Not Implemented: el servidor aun no ha implementado el método que se ha pedido, aunque es probable que se añada en un futuro.
    502 Bad Gateway: el servidor está actuando como un proxy o gateway y ha recibido una respuesta inválida del otro servidor.
    503 Service Unavailable: El error 500 es más genérico diciendo que algo pasa con el servidor, pero el 503 establece que el servidor no está disponible en ese momento. Puede que sea porque está sobrecargado con demasiadas peticiones o porque en ese momento está con tareas de mantenimiento. Prueba de nuevo en unos minutos.
    504 Gateway Timeout: el servidor está actuando como una gateway o proxy y no recibió respuesta del servidor.
    505 HTTP Version Not Supported: el servidor no soporta la versión del protocolo HTTP que se le pidió.
    506 Variant Also Negotiates: la petición resulta en una petición con referencias circulares.
    507 Insufficient Storage: el servidor no tiene espacio suficiente para completar la petición.
    508 Loop Detected: el servidor ha detectado un bucle infinito.
    510 Not Extended: el servidor requiere de extensiones para completar la petición.
    511 Network Authentication Required: el cliente necesita identificarse.
*/

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