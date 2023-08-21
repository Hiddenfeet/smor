import { ethers } from "ethers";
import PhotonSwap from "../Abi/PhotonSwap.json";
import VVS from "../Abi/VVS.json";
import CandySwap from "../Abi/CandySwap.json";
import CroDex from "../Abi/CroDex.json";
import CroSwap from "../Abi/CroSwap.json";
import MMF from "../Abi/MMF.json";
import Aggregator from "../Abi/Aggregator.json";
import Token from "../Abi/Token.json";
import WCro from "../Abi/WCro.json";
import FactoryAbi from "../Abi/FactoryAbi.json";
import value from "../value.json";
export const defaultTokens = [
  "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
  "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
];
export const allPaths = [
  [],
  ["0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23"],
  ["0xc21223249CA28397B4B6541dfFaEcC539BfF0c59"],
  [
    "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
    "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
  ],
  [
    "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
    "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
  ],
];
export const token1 = "0x66e428c3f67a68878562e79A0234c1F83c208770";
export const token2 = "0xe44Fd7fCb2b1581822D0c862B68222998a0c299a";
export function photonSwapContract(signer) {
  return new ethers.Contract(value.photonSwapAddress, PhotonSwap, signer);
}
export function mmfContract(signer) {
  return new ethers.Contract(value.mmfAddress, MMF, signer);
}
export function vssContract(signer) {
  return new ethers.Contract(value.vvsAddress, VVS, signer);
}
export function croDexContract(signer) {
  return new ethers.Contract(value.croDexAddress, CroDex, signer);
}
export function candySwapContract(signer) {
  return new ethers.Contract(value.candySwapAddress, CandySwap, signer);
}
export function croSwapContract(signer) {
  return new ethers.Contract(value.croSwapAddress, CroSwap, signer);
}
export function aggregatorContract(signer) {
  return new ethers.Contract(value.aggregatorAddress, Aggregator, signer);
}
export function tokenContract(signer, tokenAddress) {
  return new ethers.Contract(tokenAddress, Token, signer);
}
export function WCroContract(signer, tokenAddress) {
  return new ethers.Contract(tokenAddress, WCro, signer);
}
export function factoryContract(signer, factoryAddress) {
  return new ethers.Contract(factoryAddress, FactoryAbi, signer);
}

export const cronos = {
  id: 25,
  name: "CRONOS",
  network: "cronos",
  nativeCurrency: {
    decimals: 18,
    name: "CRONOS",
    symbol: "CRO",
  },
  rpcUrls: {
    public: { http: ["https://evm-cronos.crypto.org"] },
    default: { http: ["https://evm-cronos.crypto.org"] },
  },
  blockExplorers: {
    etherscan: { name: "CRONOSCAN", url: "https://cronoscan.com" },
    default: { name: "CRONOSCAN", url: "https://cronoscan.com" },
  },
  testnet: false,
};

export const tokenMap = [
  ["0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23", "CRO", "cronos.webp"],
  ["0x7C8b5501A40D382e8A11889834c80b2D7Fa1Fc4F", "CROKING", "croking.webp"],
  ["0xeC0d0f2D7dDF5e6F1Ed18711fE5DD5C790E1C4d6", "GDRT", "gdrt.webp"],
  ["0x2D03bECE6747ADC00E1a131BBA1469C15fD11e03", "VVS", "vvs.webp"],
  ["0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23", "WCRO", "cronos.webp"],
  ["0xc21223249CA28397B4B6541dfFaEcC539BfF0c59", "USDC", "usdc.webp"],
  ["0x66e428c3f67a68878562e79A0234c1F83c208770", "USDT", "usdt.webp"],
  ["0x97749c9B61F878a880DfE312d2594AE07AEd7656", "MMF", "mmf.webp"],
  ["0xF2001B145b43032AAF5Ee2884e456CCd805F677D", "DAI", "dai.webp"],
  ["0x0224010BA2d567ffa014222eD960D1fa43B8C8E1", "MINT", "minted.webp"],
  ["0xe44Fd7fCb2b1581822D0c862B68222998a0c299a", "ETH", "eth.webp"],
];
export const tokenMap2 = [
  ["0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23", "CRO", "cronos.webp"],
  ["0x7C8b5501A40D382e8A11889834c80b2D7Fa1Fc4F", "CROKING", "croking.webp"],
  ["0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23", "WCRO", "cronos.webp"],
  ["0x66e428c3f67a68878562e79A0234c1F83c208770", "USDT", "usdt.webp"],
];

// export const defaultTokenSet = new Set(["0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
// "0x2D03bECE6747ADC00E1a131BBA1469C15fD11e03",
// "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
// "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
// "0x66e428c3f67a68878562e79A0234c1F83c208770",
// "0xDD73dEa10ABC2Bff99c60882EC5b2B81Bb1Dc5B2",
// "0x97749c9B61F878a880DfE312d2594AE07AEd7656",
// "0xF2001B145b43032AAF5Ee2884e456CCd805F677D",
// "0x0224010BA2d567ffa014222eD960D1fa43B8C8E1",
// "0xe6801928061CDbE32AC5AD0634427E140EFd05F9",
// "0x39bC1e38c842C60775Ce37566D03B41A7A66C782",
// "0x0dCb0CB0120d355CdE1ce56040be57Add0185BAa"])
