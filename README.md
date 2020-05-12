# Blockchain Electronic Voting Descentralized App  - README

<img src="http://introtocrypto.com/wp-content/uploads/2017/08/ether@2x.png" height="128" width="128">

## Introducción
BEVDApp es una aplicación web de votación electronica implementada con la tecnologia de Blockchain. El front-end esta desarrollado en React, mientras que el back-end se encuentra implementado en un Smart Contract de Ethereum desarrollado en lenguaje Solidity. 
Esta aplicación fue desarrollada como una propuesta de sistema para la implementación de Blockchain para un proyecto de tesis de la universidad de Morón.

## Preparar el ambiente para desarrollo

1. Descargar e instalar [Node JS y NPM](https://nodejs.org/).
	
2. Instalar la extensión [Solidity](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity) para VS code.
	
3. Descargar proyecto [BEVDApp](https://github.com/MartinOber16/blockchain-electronic-voting) de github.

4. Instalar las dependencias del proyecto:
    ~~~
    npm install
    ~~~

5. Instalar complementos de truffle:
	~~~
    npm install truffle@4.1.15 -g --save-dev
    npm install truffle-contract --save-dev
    npm install truffle-hdwallet-provider@0.0.6 --save-dev
    ~~~

6. Descargar e iniciar la aplicación [Ganache](https://www.trufflesuite.com/ganache) para implementar una red blockchain de Ethereum localmente.
	
7. Desplegar el smart contract en la red local de Ganache:
	~~~
    truffle deploy --reset --network development
    ~~~

8. Para ejecutar el script de test para ejecutar pruebas automaticas al Smart Contract:
	~~~
    truffle test
	~~~

9. Instalar la extensión [MetaMask](https://metamask.io) en el explorador.
	
10. Iniciar la aplicación BEVDApp:
	~~~
    npm start 
	~~~

11. Dar permisos para utilizar nuestras cuentas del wallet desde el navegador:
    ~~~
    ethereum.enable();
	~~~
    
12. En la consola, comprobar si web3 esta disponible.
	~~~
    web3
	~~~


## Implementación del sistema en Ethereum

1. Crear una cuenta en [Infura.io](https://infura.io) para poder conectarse a la red sin tener que implementar un nodo Ethereum.
	
2. Configurar los datos de conexión a infura.io en el archivo "truffle-config.js".

3. Desplegar el smart contract en la red de testeo Rinkeby:
	~~~
    truffle deploy --reset --network rinkeby
    ~~~

4. Comprobar la dirección donde fue desplegado el Smart Contract:
	~~~
    truffle networks
    ~~~

5. Compilar la aplicación para publicarla en un sitio web:
	~~~
    npm run build
	~~~

6. Publicar la aplicación en [Surge.sh](https://surge.sh/):  
	~~~
    surge build
	~~~  
  

## Utilidades

* Se pueden obtener Ethers en el ambiente testeo en el sitio de [Rinkeby Authenticated Faucet](https://faucet.rinkeby.io/).  

* Para ver las transacciones y código del Smart Contract en la red se puede utilizar el explorador [EtherScan.io](https://rinkeby.etherscan.io/).  


## Autor
** Martin Obermeier. **  
*martin.obermeier@gmail.com*

** Fecha de actualización: ** 12/05/2020 14:00.
