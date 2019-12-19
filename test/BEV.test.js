// Ejecutar truffle test
// https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html

const chalk = require('chalk');
const BEV = artifacts.require('BEV');
let instance;

function log(txt){
  console.log(chalk.white("    " + txt));
}

function logContractAddress(addr) {
  console.log(chalk.greenBright("    Contract Address: " + addr));
}

function logTransaction(transaction) {
  console.log(chalk.blueBright("    Transaction Hash: " + transaction));
}

beforeEach(async () => {
  instance = await BEV.new(); // Desplega en la red configurada un smart contract para cada test
  log("");
  logContractAddress(instance.address);
});

contract('BEV', accounts => {
  // Casos de prueba
  it('El usuario 0 debe ser administrador', async() => {
    let account = accounts[0];
    log("Account 0: " + account);
    assert(await instance.admins(account));
  });

  it('El usuario 1 no debe ser administrador', async() => {
    let account = accounts[1];
    log("Account 1: " + account);
    assert(!(await instance.admins(account)));
  });

  it('Debe tener disponible una elección', async() => {
    await instance.addElection("Elección 1").then((receipt) => {
      //console.log(receipt);
      logTransaction(receipt.tx);
    });
    let total = await instance.electionsCount(); // instance.method.electionsCount();
    log("Elecciones: " + total);
    assert(total>0);
  });

  it('Debe tener disponible un candidato', async() => {
    await instance.addElection("Elección 1").then((receipt) => {
      logTransaction(receipt.tx);
    });
    await instance.addCandidate(1, "Candidato 1").then((receipt) => {
      logTransaction(receipt.tx);
    });
    let candidatos = await instance.getCandidatesCount(1);
    log("Candidatos: " + candidatos);
    assert(candidatos>0);
  });

  it('Debe tener disponible un votante', async() => {
    await instance.addElection("Elección 1").then((receipt) => {
      logTransaction(receipt.tx);
    });
    let addr = '0x64745f6442486525d046A8B4CD678B28570aDC58';
    await instance.addVoter(1, addr ,"Votante 1").then((receipt) => {
      logTransaction(receipt.tx);
    });
    let votantes = await instance.getVotersCount(1);
    log("Votantes: " + votantes);
    assert(votantes>0);
  });

});