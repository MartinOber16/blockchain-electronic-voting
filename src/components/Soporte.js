import React from "react";

// TODO: Completar información.

export default (props) => {
    return <div>
                <div className="text-left">
                    <h4>¿Qué es el voto electrónico?</h4>
                </div>
                <div className="text-justify">
                    <br />
                    <p>&emsp;Voto electrónico es una expresión que comprende varios tipos de votación, que abarca tanto modos electrónicos de emitir votos como medios electrónicos de contar los votos.</p>
                    <p>&emsp;Las tecnologías para el voto electrónico pueden incluir tarjetas perforadas, sistemas de votación mediante escáneres ópticos y quioscos de votación especializados (incluso sistemas de votación auto contenidos sistemas de votación de Registro o Grabación Electrónica Directa, DRE por sus siglas en inglés). También puede referirse a la transmisión de papeletas y votos por vía telefónica, redes de computación privadas o por Internet.</p>                                        
                    <br />
                </div>
                <hr />
                <br />
                <div className="text-left">
                    <h4>¿Qué es blockchain?</h4>
                </div>
                <div className="text-justify">
                    <br />
                    <p>&emsp;Una cadena de bloques, conocida en inglés como blockchain, es una estructura de datos en la que la información contenida se agrupa en conjuntos (bloques) a los que se les añade metainformaciones relativas a otro bloque de la cadena anterior en una línea temporal, de manera que gracias a técnicas criptográficas, la información contenida en un bloque solo puede ser repudiada o editada modificando todos los bloques posteriores. Esta propiedad permite su aplicación en un entorno distribuido de manera que la estructura de datos blockchain puede ejercer de base de datos pública no relacional que contenga un histórico irrefutable de información. ​En la práctica ha permitido, gracias a la criptografía asimétrica y las funciones de resumen o hash, la implementación de un registro contable (ledger) distribuido que permite soportar y garantizar la seguridad de dinero digital.​ Siguiendo un protocolo apropiado para todas las operaciones efectuadas sobre la blockchain, es posible alcanzar un consenso sobre la integridad de sus datos por parte de todos los participantes de la red sin necesidad de recurrir a una entidad de confianza que centralice la información. Por ello se considera una tecnología en la que la "verdad" (estado confiable del sistema) es construida, alcanzada y fortalecida por los propios miembros; incluso en un entorno en el que exista una minoría de nodos en la red con comportamiento malicioso (nodos sybil) dado que, en teoría, para comprometer los datos, un atacante requeriría de una mayor potencia de cómputo y presencia en la red que el resultante de la suma de todos los restantes nodos combinados. Por las razones anteriores, la tecnología blockchain es especialmente adecuada para escenarios en los que se requiera almacenar de forma creciente datos ordenados en el tiempo, sin posibilidad de modificación ni revisión y cuya confianza pretenda ser distribuida en lugar de residir en una entidad certificadora. Este enfoque tiene diferentes aspectos:</p>
                    <ul>
                        <li>Almacenamiento de datos: se logra mediante la replicación de la información de la cadena de bloques.</li>
                        <li>Transmisión de datos: se logra mediante redes de pares.</li>
                        <li>Confirmación de datos: se logra mediante un proceso de consenso entre los nodos participantes. El tipo de algoritmo de consenso más utilizado es el de prueba de trabajo en el que hay un proceso abierto competitivo y transparente de validación de las nuevas entradas llamada minería.</li>
                    </ul>
                    <p>&emsp;El concepto de cadena de bloque fue aplicado por primera vez en 2009 como parte de Bitcoin.</p>
                    <p>&emsp;Los datos almacenados en la cadena de bloques normalmente suelen ser transacciones (p. ej. financieras) por eso es frecuente llamar a los datos transacciones. Sin embargo, no es necesario que lo sean. Realmente podríamos considerar que lo que se registran son cambios atómicos del estado del sistema. Por ejemplo una cadena de bloques puede ser usada para estampillar documentos y asegurarlos frente a alteraciones</p>
                    <br />
                    <div className="text-center">
                        <img 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQeNhgdRDIxKdEmsK1iuRdP4j_lb5sNE_6FMSM3b9ReuhmdfG4S" 
                            alt="blockchain" 
                        />   
                    </div>
                    <br />
                </div>
                <hr />
                <br />
                <div className="text-left">
                    <h4>¿Qué es Ethereum?</h4>
                </div>
                <div className="text-justify">
                    <br />
                    <p>&emsp;Ethereum es una plataforma open source, descentralizada que permite la creación de acuerdos de contratos inteligentes entre pares, basada en el modelo blockchain.​ Cualquier desarrollador puede crear y publicar aplicaciones distribuidas que realicen contratos inteligentes. Ethereum también provee una ficha de criptomoneda que se llama ether. Se puede intercambiar ether entre cuentas diferentes y también es utilizado para compensar los nodos participantes por los cálculos realizados.</p>
                    <p>&emsp;El desarrollador de software Vitalik Buterin, propuso integrar un lenguaje Turing completo en el sistema de scripting de Bitcoin como mejora del protocolo, aunque el concepto es una idea original de Sergio Demian Lerner que desarrolla en su tesis​. El desarrollo del mismo se logró gracias a una plataforma de financiamiento colectiva, desde julio a agosto de 2014. El sistema salió definitivamente el 30 de julio 2015.</p>
                    <p>&emsp;Después de una bifurcación de la cadena de bloques en julio de 2016, hay dos líneas de Ethereum activas: Ethereum y Ethereum Clásico.</p>                    
                    <br />
                    <div className="text-center">
                        <img 
                            src="data:image/png;base64,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" 
                            alt="ethereum" 
                        />  
                    </div>
                    <br />
                </div>
                <hr />
                <br />
                <div className="text-left">
                    <h4>¿Qué es Metamask?</h4>
                </div>
                <div className="text-justify">
                    <br />
                    <p>&emsp;MetaMask es un complemento de navegador que permite a los usuarios realizar transacciones de Ethereum a través de sitios web regulares. Facilita la adopción de Ethereum porque cierra la brecha entre las interfaces de usuario para Ethereum (por ejemplo, navegadores de niebla, Dapps) y la web normal (por ejemplo, Chrome, Firefox, sitios web).</p>                    
                    <br />
                    <div className="text-center">
                        <img 
                            src="data:image/png;base64,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" 
                            alt="metamask" 
                        />  
                    </div>
                    <br />
                </div>
                <hr />
                <br />
                <div className="text-left">
                    <h4>¿Qué beneficios trae el voto electronico sobre blockchain?</h4>
                </div>
                <div className="text-justify">
                    <br />
                    <p>&emsp;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <ol> 
                        <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</li>
                        <li>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</li>
                        <li>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</li>
                    </ol>
                    <br />
                </div>
                <hr />
                <br />
                <div className="text-left">
                    <h4>Documentación</h4>
                </div>
                <div className="text-justify">
                    <ul>
                        <li><a href="https://github.com/MartinOber16/blockchain-electronic-voting/blob/master/ManualUsuario.md" target="_blank" >Manual del usuario</a></li>
                        <li><a href="https://github.com/MartinOber16/blockchain-electronic-voting/blob/master/ManualAdministrador.md" target="_blank" >Manual del administrador</a></li>
                        <li><a href="https://github.com/MartinOber16/blockchain-electronic-voting/blob/master/DocumentacionTecnica.md" target="_blank" >Documentación tecnica</a></li>
                    </ul>
                    <br />
                </div>
                <br />
            </div>
}
