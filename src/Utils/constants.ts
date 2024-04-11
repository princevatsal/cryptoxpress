import { ethers } from "ethers";
export const dUSDTAddress = "0xECd313e29b85cAf347fb832F80427602030cD3Fc";
export const polygonProvider = ethers.getDefaultProvider("maticmum");
const dUSDTAbi = [
  {
    constant: true,
    inputs: [{ name: "who", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
export const tUSDTContract = new ethers.Contract(
  dUSDTAddress,
  dUSDTAbi,
  polygonProvider
);
