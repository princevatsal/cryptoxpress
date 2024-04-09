import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import "@ethersproject/shims";
import Switch from "../src/components/atomic/Switch";
import LivePrice from "../src/components/moleculer/LivePrice";
import ImportWallet from "../src/components/moleculer/ImportWallet";
import AccountList from "../src/components/moleculer/AccountList";

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CryptoXpress</Text>
      <Switch />
      <LivePrice />
      <ImportWallet />
      <AccountList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "10%",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  priceContainer: {
    marginBottom: 20,
  },
  priceText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default App;
