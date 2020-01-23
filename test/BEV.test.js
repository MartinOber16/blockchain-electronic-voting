// Ejecutar truffle test
// https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html

// TODO: Reorganizar casos de prueba

const chalk = require('chalk');
const BEV = artifacts.require('BEV');
let instance;
const valueElection = 1000000000000000000; // 1 ether

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
    await instance.addElection("Elección 1", { from: accounts[0], value: valueElection }).then((receipt) => {
      //console.log(receipt);
      //logTransaction(receipt.tx);
    });
    
    let total = await instance.getTotalElections(); // instance.method.electionsCount();
    assert(total>0);
  });

  it('Caso 06: Obtener los detalles de una elección', async() => {
    await instance.addElection("Elección 1", { from: accounts[0], value: valueElection }).then((receipt) => {
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
    await instance.addElection("Elección 1", { from: accounts[0], value: valueElection }).then((receipt) => {
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
    await instance.addElection("Elección 1", { from: accounts[0], value: valueElection}).then((receipt) => {
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
    await instance.addElection("Elección 1", { from: accounts[0], value: valueElection }).then((receipt) => {
      //logTransaction(receipt.tx);
    });
    await instance.addCandidate(1, "Candidato 1").then((receipt) => {
      //logTransaction(receipt.tx);
    });
    let candidatos = await instance.getCandidatesCount(1);
    assert(candidatos>0);
  });

  it('Caso 10: Obtener los detalles de un candidato', async() => {
    
    await instance.addElection("Elección 1", { from: accounts[0], value: valueElection }).then((receipt) => {
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
      [election, id, name, voteCount] = receipt; 
    });

    //log(election +", " + id + ", " + name + ", " + voteCount);
    assert(name === "Candidato 1", "Nombre no es igual a Candidato 1");

  });
  
  it('Caso 11: Eliminar un candidato', async() => {
    await instance.addElection("Elección 1", { from: accounts[0], value: valueElection }).then((receipt) => {
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
    await instance.addElection("Elección 1", { from: accounts[0], value: valueElection }).then((receipt) => {
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
    await instance.addElection("Elección 1", { from: accounts[0], value: valueElection }).then((receipt) => {
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
    await instance.addElection("Elección 1", { from: accounts[0], value: valueElection }).then((receipt) => {
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

    await instance.voting(1,1, {from: votante}).then((receipt) => {
      // Data del evento
      //log("Nuevo evento -> " + votante + " ha votado en la elección " + receipt.logs[0].args._idElection.toNumber() + " por el candidato " + receipt.logs[0].args._idCandidate.toNumber()); 
      //logTransaction("Comprobante de voto: " + receipt.tx);
    });

    let yaVoto = await instance.voterHasVoted(1, votante);
    assert(yaVoto);

    var election, id, name, voteCount;
    await instance.getCandidate(1, 1).then((receipt) => {
      //console.log(receipt);
      [election, id, name, voteCount] = receipt; 
    });
    assert(voteCount >0),"voteCount <= 0";
  });

  it('Caso 16: Resultado de la votación', async() => {
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
  
    var election, id, name, voteCount; 
    await instance.getResultElection(1).then((receipt) => {
      //log(receipt);
      id = receipt;
    });
  
    await instance.getCandidate(1, id).then((receipt) => {
      //console.log(receipt);
      [election, id, name, voteCount] = receipt;
    });
      
    //log("Elección: " + election + ", Id: " + id + ", Candidato: "  + name + ", votos: " + voteCount);
    assert(id == 3);

  });

  it('Caso 17: Resultado de la votación empate', async() => {
    await instance.addElection("Elección 1", {from: accounts[0], value: valueElection}).then((receipt) => {
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

    await instance.voting(1,1,{from: accounts[0]}).then((receipt) => {
      //logTransaction("Votante: " + accounts[0] + " - Comprobante de voto: " + receipt.tx);
    });

    await instance.voting(1,2,{from: accounts[1]}).then((receipt) => {
      //logTransaction("Votante: " + accounts[1] + " - Comprobante de voto: " + receipt.tx);
    });

    await instance.voting(1,3,{from: accounts[2]}).then((receipt) => {
      //logTransaction("Votante: " + accounts[2] + " - Comprobante de voto: " + receipt.tx);
    });
  
    var id, name, voteCount; 
    await instance.getResultElection(1).then((receipt) => {
      //log(receipt);
      id = receipt;
    });
  
    if(id != 0) {
      await instance.getCandidate(1, id).then((receipt) => {
        //console.log(receipt);
        [id, name, voteCount] = receipt;
      });
    }
      
    //log("Id: " + id + ", Candidato: "  + name + ", votos: " + voteCount);
    assert(id == 0);
  });

  // TODO: Casos de prueba para probar errores

});