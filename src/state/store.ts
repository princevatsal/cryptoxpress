// counter.store.js
import React from "react";
import { makeObservable, action, observable } from "mobx";
import {
  fetchBitcoinPriceRes,
  fetchPolygonPriceRes,
  fetchTxDetail,
  getBTCBalance,
} from "../API/Resources";
import { getTransactionStatus } from "../Utils/helper";
import { getUSDTBalance } from "../Utils/ether";
class Store {
  network = "polygon";
  bitcoinPrice = null;
  usdtPrice = null;
  balance = null;
  bitcoinAddresses = [];
  polygonAddresses = [];
  polygonTrans = [];
  bitcoinTrans = [];
  updatingTnxStatus = false;

  constructor() {
    makeObservable(this, {
      network: observable,
      bitcoinPrice: observable,
      usdtPrice: observable,
      polygonAddresses: observable,
      bitcoinAddresses: observable,
      polygonTrans: observable,
      bitcoinTrans: observable,
      updatingTnxStatus: observable,
      balance: observable,
      toggleNetwork: action.bound,
      fetchBitcoinPrice: action.bound,
      fetchPolygonPrice: action.bound,
      addBitcoinAddress: action.bound,
      addPolygonAddress: action.bound,
      addPolygonTrans: action.bound,
      addBitcoinTrans: action.bound,
      setUpdatingTnxStatus: action.bound,
      updateBTCTnxStatus: action.bound,
      updatePolygonTnxStatus: action.bound,
      updateBalance: action.bound,
      setBalance: action.bound,
    });
  }

  toggleNetwork() {
    this.network = this.network === "polygon" ? "bitcoin" : "polygon";
  }
  setBalance() {
    this.balance = null;
  }
  setUpdatingTnxStatus() {
    this.updatingTnxStatus = true;
  }
  async fetchBitcoinPrice() {
    const price = await fetchBitcoinPriceRes();
    this.bitcoinPrice = price;
  }
  async fetchPolygonPrice() {
    const price = await fetchPolygonPriceRes();
    this.usdtPrice = price;
  }
  async updateBTCTnxStatus(tnxId) {
    const resp = await fetchTxDetail(tnxId);
    const status = getTransactionStatus(resp.confirmations, resp.confirmedDate);
    this.updatingTnxStatus = false;
    this.bitcoinTrans = this.bitcoinTrans.map((item) => {
      return item.hash === tnxId ? { ...item, status } : item;
    });
  }
  async updatePolygonTnxStatus(tnxId, status) {
    this.updatingTnxStatus = false;
    this.polygonTrans = this.polygonTrans.map((item) => {
      return item.hash === tnxId ? { ...item, status } : item;
    });
  }

  async addBitcoinAddress(address, key) {
    this.bitcoinAddresses.push({ address, key });
  }
  async addPolygonAddress(address, key) {
    this.polygonAddresses.push({ address, key });
  }
  async addPolygonTrans(from, to, hash, amount, maxFeePerGas, status) {
    this.polygonTrans.push({ from, to, hash, amount, maxFeePerGas, status });
  }
  async addBitcoinTrans(from, to, hash, amount, maxFeePerGas, status) {
    this.bitcoinTrans.push({ from, to, hash, amount, maxFeePerGas, status });
  }
  async updateBalance(acc_id) {
    console.log("Updating balance of ", acc_id);
    let balance = null;
    if (this.network === "polygon") {
      balance = await getUSDTBalance(acc_id);
      console.log("balance", balance);
    } else {
      balance = await getBTCBalance(acc_id);
    }
    this.balance = balance;
  }
}

const appStore = new Store();
export const storeContext = React.createContext(appStore);
export const useStore = () => React.useContext(storeContext);
