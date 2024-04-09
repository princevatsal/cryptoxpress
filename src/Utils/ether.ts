import { ethers, formatEther, getDefaultProvider, parseEther } from "ethers";
const provider = ethers.getDefaultProvider("maticmum");
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
    const balance = await provider.getBalance(address);
    return formatEther(balance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return null;
  }
};
const sendMatic = async (key, to_address, amount) => {
  const wallet = new ethers.Wallet(key, provider);
  const tx = {
    to: to_address,
    value: parseEther(amount), // Convert amount to Wei
  };
  // console.log(formatEther(await wallet.estimateGas(tx)));
  try {
    const txResponse = await wallet.sendTransaction(tx);
    return { status: "success", tx: txResponse };
  } catch (error) {
    if (error?.info?.error?.code === -32000) {
      return { status: "error", msg: "Insufficient Funnd" };
    } else return { status: "error", msg: "Some error occured" };
  }
};

export { getAddressFromKey, getBalance, sendMatic };
