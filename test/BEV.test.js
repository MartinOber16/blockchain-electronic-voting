// Ejecutar truffle test
const chalk = require('chalk');
const BEV = artifacts.require('BEV');
let instance;

beforeEach(async () => {
  instance = await BEV.new(); // Desplega en la red configurada un smart contract para cada test
});

contract('BEV', accounts => {
  // Casos de prueba
  it('El usuario 0 debe ser administrador', async() => {
    let account = accounts[0];
    console.log(chalk.cyan("  Account 0: " + account));
    assert(await instance.admins(account));
  });

  it('El usuario 1 no debe ser administrador', async() => {
    let account = accounts[1];
    console.log(chalk.cyan("  Account 1: " + account));
    assert(!(await instance.admins(account)));
  });

  it('Debe tener disponible una elección', async() => {
    await instance.addElection("Elección 1");
    let total = await instance.electionsCount(); // instance.method.electionsCount();
    console.log(chalk.cyan("  Elecciones: " + total));
    assert(total>0);
  });

  it('Debe tener disponible un candidato', async() => {
    await instance.addElection("Elección 1");
    await instance.addCandidate(1, "Candidato 1");
    let candidatos = await instance.getCandidatesCount(1);
    console.log(chalk.cyan("  Candidatos: " + candidatos));
    assert(candidatos>0);
  });

  it('Debe tener disponible un votante', async() => {
    await instance.addElection("Elección 1");
    let addr = '0x64745f6442486525d046A8B4CD678B28570aDC58';
    await instance.addVoter(1, addr ,"Votante 1");
    let votantes = await instance.getVotersCount(1);
    console.log(chalk.cyan("  Votantes: " + votantes));
    assert(votantes>0);
  });

});