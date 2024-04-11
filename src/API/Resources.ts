import axios from "axios";
import endPoints from "./endpoints.json";
const fetchBitcoinPriceRes = async () => {
  try {
    const bitcoinResponse = await axios.get(endPoints.fetch_bitcoin_price.url);
    const price = bitcoinResponse?.data?.bitcoin?.inr;
    return price;
  } catch (err) {
    console.log(err);
    return null;
  }
};
const fetchPolygonPriceRes = async () => {
  try {
    const usdtResponse = await axios.get(endPoints.fetch_usdt_price.url);
    const price = usdtResponse?.data?.tether?.inr;
    return price;
  } catch (err) {
    console.log(err);
    return null;
  }
};
const getBTCBalance = async (address) => {
  try {
    const response = await axios.get(
      endPoints.fetch_bitcoin_balance.url.replace("${address}", address)
    );
    return response.data.final_balance;
  } catch (error) {
    return null;
  }
};
const broadcastBitcoinTx = async (txHex: string) => {
  try {
    const res = await axios.post(endPoints.broadcast_bitcoin_tx.url, txHex);
    return res.data;
  } catch (e) {
    console.error("Broadcast tx error:", e.message, e.response?.data);
  }
};
const getUTXO = async (address) => {
  try {
    const restURL = endPoints.fetch_utox.url.replace("${address}", address);
    const res = await axios.get(restURL);
    return res.data;
  } catch {
    return [];
  }
};
const getTxHex = async (txId) => {
  try {
    const restURL = endPoints.fetch_tx_hash.url.replace("${txId}", txId);
    const res = await axios.get(restURL);
    return res.data;
  } catch {
    return null;
  }
};
const fetchTxDetail = async (tx) => {
  try {
    const resp = await axios.get(
      endPoints.fetch_tx_details.url.replace("${tx}", tx)
    );
    return {
      confirmations: resp.data?.confirmations,
      confirmedDate: resp.data?.confirmed,
    };
  } catch (err) {
    return null;
  }
};
export {
  fetchBitcoinPriceRes,
  fetchPolygonPriceRes,
  getBTCBalance,
  broadcastBitcoinTx,
  getUTXO,
  getTxHex,
  fetchTxDetail,
};
