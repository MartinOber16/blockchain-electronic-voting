const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = 'scrap fence music urban marine wheel diamond wall wash security candy retreat';
const infuraAPI = 'fe7a5a4e5c1b412ab899c1884e1e2416'; // api de infura

// rinkeby.infura.io/v3/fe7a5a4e5c1b412ab899c1884e1e2416

module.exports = {
  networks: {
    development: {      
      host: 'localhost',
      port: 7545,
      network_id: '*',
      gas: 5000000
    },
    rinkeby: {      
      provider: () => new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/"+ infuraAPI),
      network_id: '4' // Id de rinkeby
    }
  }
}