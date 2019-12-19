// Ejecutar truffle test
// https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html

const chalk = require('chalk');
const BEV = artifacts.require('BEV');
let instance;

function log(txt){
  console.log(chalk.white("      " + txt));
}

function logAddress(txt) {
  console.log(chalk.greenBright("      " + txt));
}

function logTransaction(txt) {
  console.log(chalk.blueBright("      " + txt));
}

beforeEach(async () => {
  instance = await BEV.new(); // Desplega en la red configurada un smart contract para cada test
  //logAddress(instance.address);
});

contract('BEV', accounts => {
  // Casos de prueba
  it('Caso 01: El usuario 0 debe ser administrador', async() => {
    let account = accounts[0];
    assert(await instance.admins(account));
  });

  it('Caso 02: El usuario 1 no debe ser administrador', async() => {
    let account = accounts[1];
    assert(!(await instance.admins(account)));
  });

  it('Caso 03: Agregar un administrador', async() => {
    let account = accounts[1];
    await instance.addAdmin(account).then((receipt) => {
      //logTransaction(receipt.tx);
    });
    assert((await instance.admins(account)));
  });

  it('Caso 04: Quitar permisos de administrador', async() => {
    let account = accounts[1];
    await instance.addAdmin(account).then((receipt) => {
      //logTransaction(receipt.tx);
    });
    await instance.deleteAdmin(account).then((receipt) => {
      //logTransaction(receipt.tx);
    });
    assert(!(await instance.admins(account)));
  });

  it('Caso 05: Agregar una elección', async() => {
    await instance.addElection("Elección 1").then((receipt) => {
      //console.log(receipt);
      //logTransaction(receipt.tx);
    });
    let total = await instance.getTotalElections(); // instance.method.electionsCount();
    assert(total>0);
  });

  it('Caso 06: Obtener los detalles de una elección', async() => {
    await instance.addElection("Elección 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    let total = await instance.getTotalElections();
    var id, name, active, candidatesCount, votersCount;
    await instance.getElection(total).then((receipt) => {
      //console.log(receipt);
      [id, name, active, candidatesCount, votersCount] = receipt; 
    });
    //log(id + ", " + name + ", " + active + ", " + candidatesCount + ", " + votersCount);
    assert(name === "Elección 1");
  });

  it('Caso 07: Activar una elección', async() => {
    await instance.addElection("Elección 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    let total = await instance.getTotalElections();
    await instance.activeElection(total,true).then((receipt) => {
      //logTransaction(receipt.tx);
    });
    var id, name, active, candidatesCount, votersCount;
    await instance.getElection(total).then((receipt) => {
      //console.log(receipt);
      [id, name, active, candidatesCount, votersCount] = receipt; 
    });
    //log(id + ", " + name + ", " + active + ", " + candidatesCount + ", " + votersCount);
    assert(active);
  });
  
  it('Caso 08: Eliminar una elección', async() => {
    await instance.addElection("Elección 1").then((receipt) => {
      //logTransaction("addElection: " + receipt.tx);
    });
    let total = await instance.getTotalElections();
    await instance.deleteElection(total).then((receipt) => {
      //logTransaction("deleteElection: " + receipt.tx);
    });
    total = await instance.getTotalElections();
    assert(total==0);
  });

  it('Caso 09: Agregar un candidato', async() => {
    await instance.addElection("Elección 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    await instance.addCandidate(1, "Candidato 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    let candidatos = await instance.getCandidatesCount(1);
    assert(candidatos>0);
  });

  it('Caso 10: Obtener los detalles de un candidato', async() => {
    await instance.addElection("Elección 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    let elecciones = await instance.getTotalElections();
    await instance.addCandidate(elecciones, "Candidato 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    let candidatos = await instance.getCandidatesCount(1);
    var id, name, voteCount;
    await instance.getCandidate(elecciones, candidatos).then((receipt) => {
      //console.log(receipt);
      [id, name, voteCount] = receipt; 
    });
    //log(id + ", " + name + ", " + voteCount);
    assert(name === "Candidato 1");
  });
  
  it('Caso 11: Eliminar un candidato', async() => {
    await instance.addElection("Elección 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    let elecciones = await instance.getTotalElections();
    await instance.addCandidate(elecciones, "Candidato 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    let candidatos = await instance.getCandidatesCount(1);
    await instance.deleteCandidate(elecciones, candidatos).then((receipt) => {
      //logTransaction(receipt.tx);
    });
    candidatos = await instance.getCandidatesCount(1);
    assert(candidatos == 0);
  });

  it('Caso 12: Agregar un votante', async() => {
    await instance.addElection("Elección 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    let votante = '0x64745f6442486525d046A8B4CD678B28570aDC58';
    await instance.addVoter(1, votante ,"Votante 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    let votantes = await instance.getVotersCount(1);
    assert(votantes>0);
  });

  it('Caso 13: Comprobar si el votante esta en el padrón', async() => {
    await instance.addElection("Elección 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    let votante = '0x64745f6442486525d046A8B4CD678B28570aDC58';
    await instance.addVoter(1, votante ,"Votante 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    let votanteValido = await instance.voterIsJoined(1, votante);
    assert(votanteValido);
  });

  it('Caso 14: Eliminar un votante', async() => {
    await instance.addElection("Elección 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    let votante = '0x64745f6442486525d046A8B4CD678B28570aDC58';
    await instance.addVoter(1, votante ,"Votante 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    let votantes = await instance.getVotersCount(1);
    assert(votantes>0);

    await instance.deleteVoter(1, votante).then((receipt) => {
      //logTransaction(receipt.tx);
    });
    votantes = await instance.getVotersCount(1);
    assert(votantes==0);
  });

  it('Caso 15: Votar', async() => {
    await instance.addElection("Elección 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    await instance.addCandidate(1, "Candidato 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    //let votante = '0x64745f6442486525d046A8B4CD678B28570aDC58';
    let votante = accounts[0];
    logAddress("Votante: " + votante);
    await instance.addVoter(1, votante ,"Votante 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    await instance.voting(1,1).then((receipt) => {
      logTransaction("Comprobante de voto: " + receipt.tx);
      //log(receipt.logs); // Ver como obtener la data del evento
    });

    let yaVoto = await instance.voterHasVoted(1, votante);
    assert(yaVoto);

    var id, name, voteCount;
    await instance.getCandidate(1, 1).then((receipt) => {
      //console.log(receipt);
      [id, name, voteCount] = receipt; 
    });
    log("Candidato: "  + name + ", votos: " + voteCount);
    assert(voteCount >0);
  });

  // Transferir etheres a los votantes
  
  // Casos de prueba para probar errores

});