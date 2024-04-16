import { ethers, formatUnits, parseUnits } from "ethers";
import "../../shim";
import ECPairFactory from "ecpair";
import ecc from "@bitcoinerlab/secp256k1";
const bitcoin = require("bitcoinjs-lib");
import { broadcastBitcoinTx, getUTXO } from "../API/Resources";
import { tUSDTContract, polygonProvider, dUSDTAddress } from "./constants";
import { buildInputsFromUtxos, remainingBalaceAndFee } from "./helper";

const ECPair = ECPairFactory(ecc);
const network = bitcoin.networks.testnet;

const getPolygonAddressFromKey = (key) => {
  try {
    const wallet = new ethers.Wallet(key, polygonProvider);
    return wallet.address;
  } catch (err) {
    return null;
  }
};
const getBitcoinAddressFromPrivateKey = (key) => {
  try {
    const keyPair = ECPair.fromPrivateKey(Buffer.from(key, "hex"), network);
    const payment = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network,
    });
    return payment.address;
  } catch {
    return null;
  }
};

const getUSDTBalance = async (address) => {
  try {
    const balance = await tUSDTContract.balanceOf(address);
    return formatUnits(balance, 6);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return null;
  }
};
const sendUSDT = async (key, to_address, amount) => {
  try {
    const wallet = new ethers.Wallet(key, polygonProvider);
    const amountInWei = parseUnits(amount, 6);
    const tx = {
      to: dUSDTAddress,
      value: 0,
      data: tUSDTContract.interface.encodeFunctionData("transfer", [
        to_address,
        amountInWei,
      ]),
    };
    const txResponse = await wallet.sendTransaction(tx);
    const from = txResponse.from;
    const to = txResponse.to;
    const hash = txResponse.hash;
    const maxFeePerGas = formatUnits(txResponse.maxFeePerGas, 18) + " Gwei";
    return {
      status: "success",
      tx: { from, to, hash, maxFeePerGas, status: "pending" },
    };
  } catch (error) {
    if (error?.info?.error?.code === -32000) {
      return { status: "error", msg: "Insufficient Funnd" };
    } else return { status: "error", msg: "Some error occured" };
  }
};
const sendBTC = async (from_address, key, to_address, amount) => {
  try {
    const satoshiToSend = amount;
    const psbt = new bitcoin.Psbt({ network, maximumFeeRate: 100 });
    const keyPair = ECPair.fromPrivateKey(Buffer.from(key, "hex"), network);
    let signer = keyPair;
    const payment = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network,
    });
    const utxos = await getUTXO(payment.address);
    if (!utxos.length) throw new Error("No UTXO found");
    const inputs = await buildInputsFromUtxos(utxos);

    psbt.addInputs(inputs);
    psbt.addOutput({ address: to_address, value: Math.floor(satoshiToSend) });
    const { remainingBalance, fee } = remainingBalaceAndFee(
      utxos,
      satoshiToSend,
      signer,
      psbt,
      to_address
    );
    psbt.addOutput({
      address: from_address,
      value: remainingBalance,
    });
    psbt.signAllInputs(signer);
    psbt.finalizeAllInputs();
    const tx = psbt.extractTransaction();
    const txId = await broadcastBitcoinTx(tx.toHex());
    return {
      status: "success",
      tx: {
        from: from_address,
        hash: txId,
        to: to_address,
        maxFeePerGas: fee / 100000000 + " BTC",
        status: "pending",
      },
    };
  } catch (err) {
    return { status: "error", msg: "Some error occured" };
  }
};
const getTxnStatusPolygon = async (txnId) => {
  try {
    const receipt = await polygonProvider.getTransactionReceipt(txnId);
    const status = receipt.status === 0 ? "Failed" : "Success";
    return status;
  } catch {
    return "unknown";
  }
};
export {
  getPolygonAddressFromKey,
  getBitcoinAddressFromPrivateKey,
  getUSDTBalance,
  sendUSDT,
  sendBTC,
  getTxnStatusPolygon,
};
