// counter.store.js
import React from "react";
import { makeObservable, action, observable } from "mobx";
import { fetchBitcoinPriceRes, fetchPolygonPriceRes } from "../API/Resources";
class Store {
  network = "polygon";
  bitcoinPrice = null;
  usdtPrice = null;
  bitcoinAddresses = [];
  polygonAddresses = [];
  polygonTrans = [];
  bitcoinTrans = [];

  constructor() {
    makeObservable(this, {
      network: observable,
      bitcoinPrice: observable,
      usdtPrice: observable,
      polygonAddresses: observable,
      bitcoinAddresses: observable,
      polygonTrans: observable,
      bitcoinTrans: observable,
      toggleNetwork: action.bound,
      fetchBitcoinPrice: action.bound,
      fetchPolygonPrice: action.bound,
      addBitcoinAddress: action.bound,
      addPolygonAddress: action.bound,
      addPolygonTrans: action.bound,
      addBitcoinTrans: action.bound,
    });
  }

  toggleNetwork() {
    this.network = this.network === "polygon" ? "bitcoin" : "polygon";
  }
  async fetchBitcoinPrice() {
    const price = await fetchBitcoinPriceRes();
    this.bitcoinPrice = price;
  }
  async fetchPolygonPrice() {
    const price = await fetchPolygonPriceRes();
    this.usdtPrice = price;
  }
  async addBitcoinAddress(address, key) {
    console.log("adding addres to bitcoin ");
    this.bitcoinAddresses.push({ address, key });
  }
  async addPolygonAddress(address, key) {
    this.polygonAddresses.push({ address, key });
  }
  async addPolygonTrans(from, to, hash, amount) {
    this.polygonTrans.push({ from, to, hash, amount });
  }
  async addBitcoinTrans(from, to, hash, amount) {
    this.bitcoinTrans.push({ from, to, hash, amount });
  }
}

const appStore = new Store();
export const storeContext = React.createContext(appStore);
export const useStore = () => React.useContext(storeContext);
