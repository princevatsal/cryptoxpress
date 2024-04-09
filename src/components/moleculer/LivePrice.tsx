import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";

import { useStore } from "../../state/store";
import { observer } from "mobx-react-lite";
const LivePrice = observer(() => {
  const {
    network,
    fetchBitcoinPrice,
    fetchPolygonPrice,
    bitcoinPrice,
    usdtPrice,
  } = useStore();
  useEffect(() => {
    if (network === "polygon") fetchPolygonPrice();
    else fetchBitcoinPrice();
  }, [network]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        1 {network === "polygon" ? "USDT" : "BTC"} ={" "}
        <Text style={styles.value}>
          {network === "polygon" ? usdtPrice ?? "..." : bitcoinPrice ?? "..."}{" "}
          INR
        </Text>
      </Text>
    </View>
  );
});
export default LivePrice;

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  text: {
    fontSize: 22,
    fontWeight: "500",
  },
  value: {
    color: "#16a085",
    fontWeight: "600",
  },
});
