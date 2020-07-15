import Web3 from 'web3';
import swal from 'sweetalert';

const getWeb3 = () => {
    return new Promise( (resolve, reject) => {
        window.addEventListener('load', function (){
            try{
                let web3 = window.web3;
                // se reconstruye para utilizar una version mas actual
                if(typeof web3 !== undefined){
                    web3 = new Web3(web3.currentProvider);
                    resolve(web3);
                } else {
                    let msj = "No se encontró ningún proveedor, por favor instale Metamask"
                    console.error(msj);
                    swal(msj, "error");
                    reject();
                }
            } catch(e) {
                console.log("Error!");
                console.error(e);
                swal("Error!", e, "error");
                
            }
        });
    });
};

export default getWeb3;