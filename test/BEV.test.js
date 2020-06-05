// Ejecutar truffle test
// https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html

const chalk = require('chalk');
const BEV = artifacts.require('BEV');
let instance;
const valueElection = 1000000000000000000; // 1 ether

function log(txt){
  console.log(chalk.white("       " + txt));
}

function logAddress(txt) {
  //console.log(chalk.greenBright("       " + txt));
}

function logResult(txt) {
  //console.log(chalk.blueBright("          " + txt));
}

beforeEach(async () => {
  instance = await BEV.new(); // Desplega en la red configurada un smart contract para cada test
  logAddress(instance.address);
});

contract('BEV', accounts => {

  // Administradores
  it('Administradores', async() => {
    log('Caso 01: Comprobar si un usuario es administrador');
    let account = accounts[0];
    assert(await instance.admins(account), "El usuario 0 no es admninistrador.");

    log('Caso 02: Comprobar que un usuario no es administrador');
    account = accounts[1];
    assert(!(await instance.admins(account)), "El usuario 1 es administrador.");
        
    log('Caso 03: Agregar un administrador');
    await instance.addAdmin(account).then((receipt) => {
      logResult(receipt.tx);
    });
    assert((await instance.admins(account)), "No se puedo agregar administrador.");

    log('Caso 04: Quitar permisos de administrador');
    await instance.deleteAdmin(account).then((receipt) => {
      logResult(receipt.tx);
    });
    assert(!(await instance.admins(account)), "No se puedo quitar permisos de administrador.");
  });

  // Elecciones
  it('Elecciones', async() => {
    log('Caso 05: Agregar una elección')
    await instance.addElection("Elección 1", { from: accounts[0], value: valueElection }).then((receipt) => {
      logResult(receipt.tx);
    });
    
    let total = await instance.getTotalElections(); // instance.method.electionsCount();
    assert(total>0, "No se agrego la elección");

    log('Caso 06: Obtener los detalles de una elección');
    var id, name, estado, candidatesCount, votersCount;
    await instance.getElection(total).then((receipt) => {      
      [id, name, estado, candidatesCount, votersCount] = receipt; 
    });
    logResult(id + ", " + name + ", " + estado + ", " + candidatesCount + ", " + votersCount);
    assert(name === "Elección 1", "No se obtuvo el detalle de la elección.");

    log('Caso 07: Activar una elección');
    await instance.activeElection(total,true).then((receipt) => {
      logResult(receipt.tx);
    });
    await instance.getElection(total).then((receipt) => {      
      [id, name, estado, candidatesCount, votersCount] = receipt; 
    });
    logResult(id + ", " + name + ", " + estado + ", " + candidatesCount + ", " + votersCount);
    assert(estado > 0, "No se puedo activar la elección.");

    log('Caso 08: Eliminar una elección');
    await instance.deleteElection(total).then((receipt) => {
      logResult("deleteElection: " + receipt.tx);
    });
    total = await instance.getTotalElections();
    assert(total==0, "No se pudo eliminar la elección.");

  });

  // Candidatos
  it('Candidatos', async() => {
    await instance.addElection("Elección 1", { from: accounts[0], value: valueElection }).then((receipt) => {
      //logTransaction(receipt.tx);
    });

    log('Caso 09: Agregar un candidato')
    await instance.addCandidate(1, "Candidato 1").then((receipt) => {
      logResult(receipt.tx);
    });
    let candidatos = await instance.getCandidatesCount(1);
    assert(candidatos>0, "No se pudo agregar el candidato.");

    log('Caso 10: Obtener los detalles de un candidato');
    let elecciones = await instance.getTotalElections();
    var id, name, voteCount;
    await instance.getCandidate(elecciones, candidatos).then((receipt) => {      
      [election, id, name, voteCount] = receipt; 
    });
    logResult(election +", " + id + ", " + name + ", " + voteCount);
    assert(name === "Candidato 1", "No se pudo obtener el candidato.");

    log('Caso 11: Eliminar un candidato');
    candidatos = await instance.getCandidatesCount(1);
    await instance.deleteCandidate(elecciones, candidatos).then((receipt) => {
      logResult(receipt.tx);
    });
    candidatos = await instance.getCandidatesCount(1);
    assert(candidatos == 0, "No se pudo eliminar el candidato.");
  });

  // Votantes
  it('Votantes', async() => {
    await instance.addElection("Elección 1", { from: accounts[0], value: valueElection }).then((receipt) => {
      //logTransaction(receipt.tx);
    });
    log('Caso 12: Agregar un votante');
    let eleccion = 1;
    let votante = '0xB79f5D859a78d98a67952cCa02533b55dEDa1639';
    await instance.addVoter(eleccion, votante ,"Votante 1").then((receipt) => {
      logResult(receipt.tx);
    });
    let votantes = await instance.getVotersCount(1);
    assert(votantes>0, "No se pudo agregar el votante.");

    log('Caso 13: Comprobar si el votante esta en el padrón');
    let votanteValido = await instance.voterIsJoined(eleccion, votante);
    assert(votanteValido, "El votante no es valido.");

    log('Caso 14: Eliminar un votante')
    await instance.deleteVoter(eleccion, votante).then((receipt) => {
      logResult(receipt.tx);
    });
    votantes = await instance.getVotersCount(1);
    assert(votantes==0, "No se pudo eliminar el votante.");

  });

  // Votar
  it('Votación', async() => {    
    await instance.addElection("Elección 1", { from: accounts[0], value: valueElection }).then((receipt) => {
      //logTransaction(receipt.tx);
    });

    await instance.addCandidate(1, "Candidato 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });

    let votante = accounts[0];
    await instance.addVoter(1, votante ,"Votante 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });

    log('Caso 15: Votar');
    await instance.voting(1,1, {from: votante}).then((receipt) => {
      // Data del evento
      logResult("Nuevo evento -> " + votante + " ha votado en la elección " + receipt.logs[0].args._idElection.toNumber() + " por el candidato " + receipt.logs[0].args._idCandidate.toNumber()); 
      logResult(receipt.tx);
    });

    let yaVoto = await instance.voterHasVoted(1, votante);
    assert(yaVoto, "No se pudo registrar el voto.");

    var election, id, name, voteCount;
    await instance.getCandidate(1, 1).then((receipt) => {      
      [election, id, name, voteCount] = receipt; 
    });
    assert(voteCount >0,"El candidato no tiene votos.");  
    
  });

  // Resultados
  it('Resultado de la votación', async() => {

    await instance.addElection("Elección 1", { from: accounts[0], value: valueElection }).then((receipt) => {
      //logTransaction(receipt.tx);
    });
    
    await instance.addCandidate(1, "Candidato 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });

    await instance.addCandidate(1, "Candidato 2").then((receipt) => {
      //logTransaction(receipt.tx);
    });

    await instance.addCandidate(1, "Candidato 3").then((receipt) => {
      //logTransaction(receipt.tx);
    });

    await instance.addVoter(1, accounts[0],"Votante 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });

    await instance.addVoter(1, accounts[1],"Votante 2").then((receipt) => {
      //logTransaction(receipt.tx);
    });

    await instance.addVoter(1, accounts[2],"Votante 3").then((receipt) => {
      //logTransaction(receipt.tx);
    });

    await instance.voting(1,3,{from: accounts[0]}).then((receipt) => {
      //logTransaction("Votante: " + accounts[0] + " - Comprobante de voto: " + receipt.tx);
    });

    await instance.voting(1,1,{from: accounts[1]}).then((receipt) => {
      //logTransaction("Votante: " + accounts[1] + " - Comprobante de voto: " + receipt.tx);
    });

    await instance.voting(1,3,{from: accounts[2]}).then((receipt) => {
      //logTransaction("Votante: " + accounts[2] + " - Comprobante de voto: " + receipt.tx);
    });
  
    log('Caso 16: Obtener candidato ganador de la votación');
    var election, id, name, voteCount; 
    await instance.getResultElection(1).then((receipt) => {      
      id = receipt;
    });
  
    await instance.getCandidate(1, id).then((receipt) => {      
      [election, id, name, voteCount] = receipt;
    });
      
    logResult("Elección: " + election + ", Id: " + id + ", Candidato: "  + name + ", votos: " + voteCount);
    assert(id == 3, "Error al obtener resultados de la votación.");

  });

  it('Transferencia de fondos', async() => {

    await instance.addElection("Elección 1", { from: accounts[0], value: valueElection }).then((receipt) => {
      //logTransaction(receipt.tx);
    });

    log('Caso 17: Transferir fondos a una cuenta');    
    let balanceContract = (await instance.getContractBalance()).toNumber();    

    await instance.transferFromContract(accounts[0],500000000000000000,{from: accounts[0]}).then((receipt) => {
      logResult(receipt.tx);
    });

    let balanceContract2 = (await instance.getContractBalance()).toNumber();    

    assert(balanceContract > balanceContract2, "Error al transferir fondos.");
  });

});