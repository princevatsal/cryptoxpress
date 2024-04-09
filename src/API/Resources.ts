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
const getBitcoinAddressFromKey = async (key) => {
  try {
    const addrResponse = await axios.get(
      endPoints.fetch_bitcoin_address.url + key
    );
    const addr = addrResponse.data.address;
    return addr;
  } catch (err) {
    if (err?.response?.data?.msg === "invalid_key") {
      return "invalid_key";
    }
    return null;
  }
};

const getBitcoinBalance = async (address) => {
  try {
    const resp = await axios.get(endPoints.fetch_bitcoin_balance.url + address);
    const addr = resp?.data?.balance;
    return addr;
  } catch (err) {
    console.log(err?.response, "err");
    return null;
  }
};

export {
  fetchBitcoinPriceRes,
  fetchPolygonPriceRes,
  getBitcoinAddressFromKey,
  getBitcoinBalance,
};
