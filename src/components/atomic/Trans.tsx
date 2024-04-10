import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function Trans({ from, to, hash, amount, maxFeePerGas }) {
  return (
    <View style={styles.container}>
      <Text style={styles.line}>From: {from}</Text>
      <Text style={styles.line}>To: {to}</Text>
      <Text style={styles.line}>hash: {hash}</Text>
      <Text style={styles.line}>amount: {amount}</Text>
      <Text style={styles.line}>gas fee: {maxFeePerGas}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#efeff0",
    elevation: 5,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: "2%",
  },
  line: {
    fontSize: 15,
    marginBottom: 10,
  },
});
