import { ethers, formatUnits, parseUnits } from "ethers";
const provider = ethers.getDefaultProvider("maticmum");
const tUSDAddress = "0xECd313e29b85cAf347fb832F80427602030cD3Fc";
const tUSDAbi = [
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
const tUSDContract = new ethers.Contract(tUSDAddress, tUSDAbi, provider);

const getAddressFromKey = (key) => {
  try {
    const wallet = new ethers.Wallet(key, provider);
    return wallet.address;
  } catch (err) {
    return null;
  }
};

const getBalance = async (address) => {
  try {
    const balance = await tUSDContract.balanceOf(address);
    return formatUnits(balance, 6);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return null;
  }
};
const sendMatic = async (key, to_address, amount) => {
  const wallet = new ethers.Wallet(key, provider);
  const amountInWei = parseUnits(amount, 6);
  const tx = {
    to: tUSDAddress,
    value: 0,
    data: tUSDContract.interface.encodeFunctionData("transfer", [
      to_address,
      amountInWei,
    ]),
  };
  // console.log(formatEther(await wallet.estimateGas(tx)));
  try {
    const txResponse = await wallet.sendTransaction(tx);
    const from = txResponse.from;
    const to = txResponse.to;
    const hash = txResponse.hash;
    const maxFeePerGas = formatUnits(txResponse.maxFeePerGas, 18);
    return { status: "success", tx: { from, to, hash, maxFeePerGas } };
  } catch (error) {
    if (error?.info?.error?.code === -32000) {
      return { status: "error", msg: "Insufficient Funnd" };
    } else return { status: "error", msg: "Some error occured" };
  }
};

export { getAddressFromKey, getBalance, sendMatic };
