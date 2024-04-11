import axios from "axios";
import endPoints from "./endpoints.json";
/**
 * Fetches the current price of Bitcoin in INR.
 * @returns {number|null} The current price of Bitcoin in INR, or null if an error occurs.
 */
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

/**
 * Fetches the current price of USDT in INR.
 * @returns {number|null} The current price of USDT in INR, or null if an error occurs.
 */
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

/**
Retrieves the balance of a Bitcoin address.
@param {string} address - The Bitcoin address to retrieve the balance for.
@returns {number|null} - The final balance of the address, or null if an error occurred.
*/
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

/**
 * Broadcasts a Bitcoin transaction to the network.
 * @param {string} txHex - The hexadecimal representation of the transaction.
 * @returns A Promise that resolves to the response data contains infor about tx.
 */
const broadcastBitcoinTx = async (txHex: string) => {
  try {
    const res = await axios.post(endPoints.broadcast_bitcoin_tx.url, txHex);
    return res.data;
  } catch (e) {
    console.error("Broadcast tx error:", e.message, e.response?.data);
  }
};

/**
 * Retrieves the UTXO (Unspent Transaction Outputs) for a given address.
 * @param {string} address The address for which to retrieve the UTXO.
 * @returns An array of UTXO objects.
 */
const getUTXO = async (address) => {
  try {
    const restURL = endPoints.fetch_utox.url.replace("${address}", address);
    const res = await axios.get(restURL);
    return res.data;
  } catch {
    return [];
  }
};

/**
 * Retrieves the Transaction hax for a given address.
 * @param {string} txID The transaction id.
 * @returns {string} transaction hex.
 */
const getTxHex = async (txId) => {
  try {
    const restURL = endPoints.fetch_tx_hash.url.replace("${txId}", txId);
    const res = await axios.get(restURL);
    return res.data;
  } catch {
    return null;
  }
};

/**
Fetches transaction details for a given transaction ID.
@param {string} tx - The transaction ID.
@returns {object} - An object containing the number of confirmations and the confirmed date.
*/
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
