import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import contract from "../../../artifacts/contracts/House.sol/House.json";
const alchemyKey = process.env.REACT_APP_API_URL;
const contractAddress = process.env.REACT_APP_DEPLOYED_CONTRACT;
export const web3 = createAlchemyWeb3(alchemyKey);
export const tokenContract = new web3.eth.Contract(contract.abi, contractAddress);

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: err.message,
      };
    }
  } else {
    return {
      address: "",
      status: "Please install Metamask",
    };
  }
};