import Web3 from 'web3';
import swal from 'sweetalert';

const getWeb3 = () => {
    return new Promise( (resolve, reject) => {
        window.addEventListener('load', function (){
            try{
                let web3 = window.web3;
                // se reconstruye para utilizar una version mas actual
                if(web3 !== undefined){
                    web3 = new Web3(web3.currentProvider);
                    resolve(web3);
                } else {
                    let msj = 'No se encontró ningún proveedor web3 para interactuar con la aplicación, por favor instale Metamask (https://metamask.io/).'; 
                    swal("Error!", msj, "error");
                    console.error(msj);
                    reject();
                }
            } catch(e) {
                swal("Error!", e.toString(), "error");
                console.error(e);
            }
        });
    });
};

export default getWeb3;