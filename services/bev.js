import BEVContract from "../build/contracts/BEV.json";
import contract from "truffle-contract";

export default async (provider) => {
    const BEV = contract(BEVContract);
    BEV.setProvider(provider);

    let instance = await BEV.deployed();
    console.log("instance address: " + instance.address);
    return instance;
}
