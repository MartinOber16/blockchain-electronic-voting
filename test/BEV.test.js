// Ejecutar comando "truffle test"
// https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html

const chalk = require('chalk');
const BEV = artifacts.require('BEV');
let instance;
const valueElection = 100000000000000000; // 0,1 ether

function log(txt){
  console.log(chalk.white("       " + txt));
}

function logAddress(txt) {
  console.log(chalk.greenBright("         " + txt));
}

function logResult(txt) {
  console.log(chalk.blueBright("         " + txt));
}

beforeEach(async () => {
  instance = await BEV.new(); // Desplega en la red configurada un smart contract para cada test
  //log('Smart contract address: ' + instance.address);
});

contract('BEV', async (accounts) => {

  it('PU01: Comprobar que un usuario es administrador del sistema.', async() => {
    let cuenta = accounts[0];
    logAddress('Usuario[0]: ' + cuenta);
    assert(await instance.admins(cuenta), "El usuario no es admninistrador.");
    logResult('El usuario es admninistrador.');
  });

  it('PU02: Comprobar que un usuario no es administrador del sistema.', async() => {
    let cuenta = accounts[1];
    logAddress('Usuario[1]: ' + cuenta);
    assert(!(await instance.admins(cuenta)), "El usuario es administrador.");
    logResult('El usuario no es admninistrador.');    
 });

  it('PU03: Agregar permisos de administrador del sistema.', async() => {
    let cuenta = accounts[1];
    logAddress('Usuario[1]: ' + cuenta);
    await instance.addAdmin(cuenta).then((receipt) => {
      logResult('Transacción de agregar permisos de administrador: ' + receipt.tx);
    });
    assert((await instance.admins(cuenta)), "No se pudo agregar permisos de administrador.");
    logResult('El usuario es admninistrador.');
 });

  it('PU04: Quitar permisos de administrador del sistema.', async() => {
    let cuenta = accounts[1];
    logAddress('Usuario[1]: ' + cuenta);
    await instance.addAdmin(cuenta).then((receipt) => {
      //logResult('Transacción de agregar permisos de administrador: ' + receipt.tx);
    });
    await instance.deleteAdmin(cuenta).then((receipt) => {
      logResult('Transacción de quitar permisos de administrador: ' + receipt.tx);
    });
    assert(!(await instance.admins(cuenta)), "No se pudo quitar permisos de administrador.");
    logResult('El usuario no es admninistrador.');

  });

  it('PU05: Generar una nueva elección.', async() => {
    let cuenta = accounts[0];
    let nombre = 'Elección 1';
    let descripcion = 'Descripción de elección 1';
    await instance.addElection(nombre, descripcion, { from: cuenta, value: valueElection }).then((receipt) => {
      logResult('Transacción de agregar una elección: ' + receipt.tx);
    });

    let elecciones = await instance.getTotalElections(); 
    logResult('Cantidad de elecciones: ' + elecciones);
    assert(elecciones>0, 'No hay elecciones');
  });

  it('PU06: Obtener los detalles de una elección.', async() => {
    let cuenta = accounts[0];
    let nombre = 'Elección 1';
    let descripcion = 'Descripción de elección 1';
    await instance.addElection(nombre, descripcion, { from: cuenta, value: valueElection }).then((receipt) => {
      //logResult('Transacción de agregar una elección: ' + receipt.tx);
    });

    let elecciones = await instance.getTotalElections();
    assert(elecciones>0, 'No hay elecciones');

    var id, name, estado, candidatesCount, votersCount;
    await instance.getElection(elecciones).then((receipt) => {      
      [id, name, description, estado, candidatesCount, votersCount] = receipt; 
    });
    logResult('Elección: ' + id + ', nombre: ' + name + ', descripción: ' + description + ', estado: ' + estado + ', candidatos: ' + candidatesCount + ', votantes: ' + votersCount);
    assert(name === "Elección 1", "No se obtuvo el detalle de la elección.");

  });

  it('PU07: Iniciar periodo de votación en una elección.', async() => {
    let cuenta = accounts[0];
    let nombre = 'Elección 1';
    let descripcion = 'Descripción de elección 1';
    await instance.addElection(nombre, descripcion, { from: cuenta, value: valueElection }).then((receipt) => {
      //logResult('Transacción de agregar una elección: ' + receipt.tx);
    });

    let elecciones = await instance.getTotalElections(); 
    assert(elecciones>0, 'No hay elecciones');

    await instance.activeElection(elecciones,{from: cuenta}).then((receipt) => {
      logResult('Transacción de iniciar periodo de votación: ' + receipt.tx);
    });

    var id, name, estado, candidatesCount, votersCount;
    await instance.getElection(elecciones).then((receipt) => {      
      [id, name, description, estado, candidatesCount, votersCount] = receipt; 
    });
    logResult('Elección: ' + id + ', nombre: ' + name + ', descripción: ' + description + ', estado: ' + estado + ', candidatos: ' + candidatesCount + ', votantes: ' + votersCount);
    assert(estado > 0, "No se puedo activar la elección.");
  });

  it('PU08: Finalizar periodo de votación en una elección.', async() => {
    let cuenta = accounts[0];
    let nombre = 'Elección 1';
    let descripcion = 'Descripción de elección 1';
    await instance.addElection(nombre, descripcion, { from: cuenta, value: valueElection }).then((receipt) => {
      //logResult('Transacción de agregar una elección: ' + receipt.tx);
    });

    let elecciones = await instance.getTotalElections();
    assert(elecciones>0, 'No hay elecciones');

    await instance.activeElection(elecciones,{from: cuenta}).then((receipt) => {
      //logResult('Transacción de iniciar periodo de votación: ' + receipt.tx);
    });

    await instance.activeElection(elecciones,{from: cuenta}).then((receipt) => {
      logResult('Transacción de finalizar periodo de votación: ' + receipt.tx);
    });

    var id, name, estado, candidatesCount, votersCount;
    await instance.getElection(elecciones).then((receipt) => {      
      [id, name, description, estado, candidatesCount, votersCount] = receipt; 
    });
    logResult('Elección: ' + id + ', nombre: ' + name + ', descripción: ' + description + ', estado: ' + estado + ', candidatos: ' + candidatesCount + ', votantes: ' + votersCount);
    assert(estado > 1, "No se puedo finalizar la elección.");
  });

  it('PU09: Eliminar una elección.', async() => {
    let cuenta = accounts[0];
    let nombre = 'Elección 1';
    let descripcion = 'Descripción de elección 1';
    await instance.addElection(nombre, descripcion, { from: cuenta, value: valueElection }).then((receipt) => {
      //logResult('Transacción de agregar una elección: ' + receipt.tx);
    });

    let elecciones = await instance.getTotalElections();
    assert(elecciones>0, 'No hay elecciones');

    await instance.deleteElection(elecciones, {from: cuenta}).then((receipt) => {
      logResult("Transacción de eliminar elección: " + receipt.tx);
    });

    elecciones = await instance.getTotalElections();
    logResult('Total de elecciónes: ' + elecciones);
    assert(elecciones==0, "No se pudo eliminar la elección.");

  });

  it('PU10: Agregar un candidato a una elección.', async() => {
    let cuenta = accounts[0];
    let nombre = 'Elección 1';
    let descripcion = 'Descripción de elección 1';
    await instance.addElection(nombre, descripcion, { from: cuenta, value: valueElection }).then((receipt) => {
      //logResult('Transacción de agregar una elección: ' + receipt.tx);
    });

    let elecciones = await instance.getTotalElections();
    assert(elecciones>0, 'No hay elecciones');

    let candidato = 'Candidato 1';
    let desCandidato = 'Descripción del candidato 1';
    await instance.addCandidate(elecciones, candidato,desCandidato, {from: cuenta}).then((receipt) => {
      logResult('Transacción de agregar candidato: ' + receipt.tx);
    });
    let candidatos = await instance.getCandidatesCount(elecciones);
    logResult('Cantidad de candidatos: ' + candidatos);
    assert(candidatos>0, "No se pudo agregar el candidato.");

  });

  it('PU11: Obtener los detalles de un candidato de una elección.', async() => {
    let cuenta = accounts[0];
    let nombre = 'Elección 1';
    let descripcion = 'Descripción de elección 1';
    await instance.addElection(nombre, descripcion, { from: cuenta, value: valueElection }).then((receipt) => {
      //logResult('Transacción de agregar una elección: ' + receipt.tx);
    });

    let elecciones = await instance.getTotalElections();
    assert(elecciones>0, 'No hay elecciones');

    let candidato = 'Candidato 1';
    let desCandidato = 'Descripción del candidato 1';
    await instance.addCandidate(elecciones, candidato,desCandidato, {from: cuenta}).then((receipt) => {
      //logResult('Transacción de agregar candidato: ' + receipt.tx);
    });
    let candidatos = await instance.getCandidatesCount(elecciones);
    //logResult('Cantidad de candidatos: ' + candidatos);
    assert(candidatos>0, 'No se pudo agregar el candidato.');

    let id, name, voteCount;
    await instance.getCandidate(elecciones, candidatos).then((receipt) => {      
      [election, id, name, description, voteCount] = receipt; 
    });
    logResult('Elección: ' + election + ', candidato: ' + id + ', nombre: ' + name + ', descripción: ' + description + ', votos: ' + voteCount);
    assert(name === 'Candidato 1', 'No se pudo obtener el candidato.');

  });

  it('PU12: Eliminar un candidato de una elección.', async() => {
    let cuenta = accounts[0];
    let nombre = 'Elección 1';
    let descripcion = 'Descripción de elección 1';
    await instance.addElection(nombre, descripcion, { from: cuenta, value: valueElection }).then((receipt) => {
      //logResult('Transacción de agregar una elección: ' + receipt.tx);
    });

    let elecciones = await instance.getTotalElections();
    assert(elecciones>0, 'No hay elecciones');

    let candidato = 'Candidato 1';
    let desCandidato = 'Descripción del candidato 1';
    await instance.addCandidate(elecciones, candidato,desCandidato, {from: cuenta}).then((receipt) => {
      //logResult('Transacción de agregar candidato: ' + receipt.tx);
    });
    let candidatos = await instance.getCandidatesCount(elecciones);
    //logResult('Cantidad de candidatos: ' + candidatos);
    assert(candidatos>0, 'No se pudo agregar el candidato.');

    await instance.deleteCandidate(elecciones, candidatos, {from: cuenta}).then((receipt) => {
      logResult('Transacción de eliminar candidato: ' + receipt.tx);
    });
    candidatos = await instance.getCandidatesCount(elecciones);
    logResult('Cantidad de candidatos: ' + candidatos);
    assert(candidatos == 0, "No se pudo eliminar el candidato.");

  });

  it('PU13: Agregar un nuevo votante a una elección.', async() => {
    let cuenta = accounts[0];
    let nombre = 'Elección 1';
    let descripcion = 'Descripción de elección 1';
    await instance.addElection(nombre, descripcion, { from: cuenta, value: valueElection }).then((receipt) => {
      //logResult('Transacción de agregar una elección: ' + receipt.tx);
    });

    let elecciones = await instance.getTotalElections();
    assert(elecciones>0, 'No hay elecciones');

    let votante = accounts[1];
    let nombreVotante= 'Votante 1';
    let desVotante = 'Descripción del votante 1';
    let saldo = 300000000000000;
    await instance.addVoter(elecciones, votante, nombreVotante, desVotante, saldo, {from: cuenta}).then((receipt) => {
      logResult('Transacción de agregar votante: ' + receipt.tx);
    });
    let votantes = await instance.getVotersCount(elecciones);
    logResult('Cantidad de votantes: ' + votantes);
    assert(votantes>0, "No se pudo agregar el votante.");

  });

  it('PU14: Comprobar si un votante esta en el padrón de una elección.', async() => {
    let cuenta = accounts[0];
    let nombre = 'Elección 1';
    let descripcion = 'Descripción de elección 1';
    await instance.addElection(nombre, descripcion, { from: cuenta, value: valueElection }).then((receipt) => {
      //logResult('Transacción de agregar una elección: ' + receipt.tx);
    });

    let elecciones = await instance.getTotalElections();
    assert(elecciones>0, 'No hay elecciones');

    let votante = accounts[1];
    let nombreVotante= 'Votante 1';
    let desVotante = 'Descripción del votante 1';
    let saldo = 300000000000000;
    await instance.addVoter(elecciones, votante, nombreVotante, desVotante, saldo, {from: cuenta}).then((receipt) => {
      //logResult('Transacción de agregar votante: ' + receipt.tx);
    });
    let votantes = await instance.getVotersCount(elecciones);
    //logResult('Cantidad de votantes: ' + votantes);
    assert(votantes>0, "No se pudo agregar el votante.");

    let votanteValido = await instance.voterIsJoined(elecciones, votante);
    assert(votanteValido, "El votante no es valido.");

    let election, addr, name, description, voted;
    await instance.getVoter(elecciones, votante, {from: cuenta}).then((receipt) => {
      [election, addr, name, description, voted] = receipt;
    });
    logResult('Elección: ' + election + ', cuenta: ' + addr + ', nombre: ' + name + ', descripción: ' + description + ', ya voto: ' + voted);
    assert(name === 'Votante 1', 'No se pudo obtener el candidato.');

  });

  it('PU15: Eliminar un votante de una elección.', async() => {
    let cuenta = accounts[0];
    let nombre = 'Elección 1';
    let descripcion = 'Descripción de elección 1';
    await instance.addElection(nombre, descripcion, { from: cuenta, value: valueElection }).then((receipt) => {
      //logResult('Transacción de agregar una elección: ' + receipt.tx);
    });

    let elecciones = await instance.getTotalElections();
    assert(elecciones>0, 'No hay elecciones');

    let votante = accounts[1];
    let nombreVotante= 'Votante 1';
    let desVotante = 'Descripción del votante 1';
    let saldo = 300000000000000;
    await instance.addVoter(elecciones, votante, nombreVotante, desVotante, saldo, {from: cuenta}).then((receipt) => {
      //logResult('Transacción de agregar votante: ' + receipt.tx);
    });
    let votantes = await instance.getVotersCount(elecciones);
    //logResult('Cantidad de votantes: ' + votantes);
    assert(votantes>0, "No se pudo agregar el votante.");

    let votanteValido = await instance.voterIsJoined(elecciones, votante);
    assert(votanteValido, "El votante no es valido.");

    await instance.deleteVoter(elecciones, votante, {from: cuenta}).then((receipt) => {
      logResult('Transacción de eliminar votante: ' +  receipt.tx);
    });
    votantes = await instance.getVotersCount(1);
    logResult('Cantidad de votantes: ' + votantes);
    assert(votantes==0, "No se pudo eliminar el votante.");

  });

  it('PU16: Realizar un voto en una elección.', async() => {
    let cuenta = accounts[0];
    let nombre = 'Elección 1';
    let descripcion = 'Descripción de elección 1';
    await instance.addElection(nombre, descripcion, { from: cuenta, value: valueElection }).then((receipt) => {
      //logResult('Transacción de agregar una elección: ' + receipt.tx);
    });

    let elecciones = await instance.getTotalElections(); 
    assert(elecciones>0, 'No hay elecciones');

    let candidato = 'Candidato 1';
    let desCandidato = 'Descripción del candidato 1';
    await instance.addCandidate(elecciones, candidato, desCandidato, {from: cuenta}).then((receipt) => {
      //logResult('Transacción de agregar candidato: ' + receipt.tx);
    });

    let candidatos = await instance.getCandidatesCount(elecciones);
    assert(candidatos>0, 'No se pudo agregar el candidato.');

    let votante = accounts[0];
    let nombreVotante= 'Votante 1';
    let desVotante = 'Descripción del votante 1';
    let saldo = 300000000000000;
    await instance.addVoter(elecciones, votante, nombreVotante, desVotante, saldo, {from: cuenta}).then((receipt) => {
      //logResult('Transacción de agregar votante: ' + receipt.tx);
    });

    let votantes = await instance.getVotersCount(elecciones);
    assert(votantes>0, "No se pudo agregar el votante.");

    await instance.activeElection(elecciones,{from: cuenta}).then((receipt) => {
      //logResult('Transacción de iniciar periodo de votación: ' + receipt.tx);
    });

    await instance.voting(elecciones, candidatos, {from: votante}).then((receipt) => {
      logResult('Transacción de voto: ' + receipt.tx);
      //logResult("Nuevo evento -> " + votante + " ha votado en la elección " + receipt.logs[0].args._idElection.toNumber() + " por el candidato " + receipt.logs[0].args._idCandidate.toNumber()); 
    });

    let yaVoto = await instance.voterHasVoted(elecciones, votante);
    logResult('Voto registrado: ' + yaVoto);
    assert(yaVoto, "No se pudo registrar el voto.");

    var election, id, name, description, voteCount;
    await instance.getCandidate(elecciones, candidatos).then((receipt) => {      
      [election, id, name, description, voteCount] = receipt; 
    });
    logResult('Votos de ' + name + ': ' + voteCount);
    assert(voteCount >0,"El candidato no tiene votos."); 

  });

  it('PU17: Obtener resultado de una elección.', async() => {
    let cuenta = accounts[0];
    let nombre = 'Elección 1';
    let descripcion = 'Descripción de elección 1';
    await instance.addElection(nombre, descripcion, { from: cuenta, value: valueElection }).then((receipt) => {
      //logResult('Transacción de agregar una elección: ' + receipt.tx);
    });

    let elecciones = await instance.getTotalElections(); 
    assert(elecciones>0, 'No hay elecciones');

    let candidato1 = 'Candidato 1';
    let desCandidato1 = 'Descripción del candidato 1';
    await instance.addCandidate(elecciones, candidato1, desCandidato1, {from: cuenta}).then((receipt) => {
      //logResult('Transacción de agregar candidato: ' + receipt.tx);
    });

    let candidato2 = 'Candidato 2';
    let desCandidato2 = 'Descripción del candidato 2';
    await instance.addCandidate(elecciones, candidato2, desCandidato2, {from: cuenta}).then((receipt) => {
      //logResult('Transacción de agregar candidato: ' + receipt.tx);
    });

    let candidatos = await instance.getCandidatesCount(elecciones);
    logResult('Candidatos: ' + candidatos);
    assert(candidatos>0, 'No se pudo agregar el candidato.');

    let votante1 = accounts[0];
    let nombreVotante1 = 'Votante 1';
    let desVotante1 = 'Descripción del votante 1';
    let saldo1 = 300000000000000;
    await instance.addVoter(elecciones, votante1, nombreVotante1, desVotante1, saldo1, {from: cuenta}).then((receipt) => {
      //logResult('Transacción de agregar votante: ' + receipt.tx);
    });

    let votante2 = accounts[1];
    let nombreVotante2 = 'Votante 2';
    let desVotante2 = 'Descripción del votante 2';
    let saldo2 = 300000000000000;
    await instance.addVoter(elecciones, votante2, nombreVotante2, desVotante2, saldo2, {from: cuenta}).then((receipt) => {
      //logResult('Transacción de agregar votante: ' + receipt.tx);
    });

    let votante3 = accounts[2];
    let nombreVotante3 = 'Votante 3';
    let desVotante3 = 'Descripción del votante 3';
    let saldo3 = 300000000000000;
    await instance.addVoter(elecciones, votante3, nombreVotante3, desVotante3, saldo3, {from: cuenta}).then((receipt) => {
      //logResult('Transacción de agregar votante: ' + receipt.tx);
    });

    let votantes = await instance.getVotersCount(elecciones);
    logResult('Votantes: ' + votantes);
    assert(votantes>0, "No se pudo agregar el votante.");

    await instance.activeElection(elecciones,{from: cuenta}).then((receipt) => {
      //logResult('Transacción de iniciar periodo de votación: ' + receipt.tx);
    });

    await instance.voting(elecciones, candidatos, {from: votante1}).then((receipt) => {
      //logResult('Transacción de voto: ' + receipt.tx);
    });

    await instance.voting(elecciones, (candidatos-1), {from: votante2}).then((receipt) => {
      //logResult('Transacción de voto: ' + receipt.tx);
    });

    await instance.voting(elecciones, candidatos, {from: votante3}).then((receipt) => {
      //logResult('Transacción de voto: ' + receipt.tx); 
    });

    await instance.activeElection(elecciones,{from: cuenta}).then((receipt) => {
      //logResult('Transacción de finalizar periodo de votación: ' + receipt.tx);
    });

    var election, id, name, description, voteCount;
    await instance.getResultElection(elecciones).then((receipt) => {      
      id = receipt;
    });

    await instance.getCandidate(elecciones, id).then((receipt) => {      
      [election, id, name, description, voteCount] = receipt; 
    });

    logResult('Elección: ' + election + ', candidato: ' + id + ', nombre: '  + name + ', descripción: ' + description + ', votos: ' + voteCount);
    assert(id == 2, 'Error al obtener resultados de la votación.');

  }); 

  it('PU18: Retirar fondos del smart contract a una cuenta.', async() => {

    let cuenta = accounts[0];
    let nombre = 'Elección 1';
    let descripcion = 'Descripción de elección 1';
    await instance.addElection(nombre, descripcion, { from: cuenta, value: valueElection }).then((receipt) => {
      //logResult('Transacción de agregar una elección: ' + receipt.tx);
    });

    let balanceContract = (await instance.getContractBalance()).toNumber();    
    logResult('Balance del contrato: ' + balanceContract);
  
    let cuentaDestino = accounts[1];
    let importe = 50000000000000000;
    await instance.transferFromContract(cuentaDestino, importe,{from: accounts[0]}).then((receipt) => {
      logResult('Transacción de retiro de fondos: ' + receipt.tx);
    });

    let balanceContract2 = (await instance.getContractBalance()).toNumber();    
    logResult('Balance del contrato: ' + balanceContract2);
    assert(balanceContract > balanceContract2, "Error al transferir fondos.");
  });


  it('PU19: Depositar fondos en el smart contract.', async() => {
    let balanceContract = (await instance.getContractBalance()).toNumber();    
    logResult('Balance del contrato: ' + balanceContract);
  
    let cuenta = accounts[0];
    let importe = 50000000000000000;
    await instance.transferToContract({from: cuenta, value: importe}).then((receipt) => {
      logResult('Transacción de deposito de fondos: ' + receipt.tx);
    });

    let balanceContract2 = (await instance.getContractBalance()).toNumber();    
    logResult('Balance del contrato: ' + balanceContract2);
    assert(balanceContract < balanceContract2, "Error al depositar fondos.");
  });

});