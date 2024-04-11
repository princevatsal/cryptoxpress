import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import React, { useState } from "react";
import { useStore } from "../../state/store";
import { observer } from "mobx-react-lite";
import endPoints from "../../API/endpoints.json";
import { getTxnStatusPolygon } from "../../Utils/ether";

type TransPropType = {
  from: string;
  to: string;
  hash: string;
  amount: number;
  maxFeePerGas: string;
  status: string;
};
const Trans = observer(
  ({ from, to, hash, amount, maxFeePerGas, status }: TransPropType) => {
    const {
      network,
      updatingTnxStatus,
      updateBTCTnxStatus,
      updatePolygonTnxStatus,
      setUpdatingTnxStatus,
    } = useStore();
    const refereshTnxStatus = async () => {
      setUpdatingTnxStatus();
      if (network === "polygon") {
        const status = await getTxnStatusPolygon(hash);
        updatePolygonTnxStatus(hash, status);
      } else updateBTCTnxStatus(hash);
    };
    const explorer_endpoint = (
      network === "polygon"
        ? endPoints.explorer_link_polygon
        : endPoints.explorer_link
    ).url.replace("${tx}", hash);
    return (
      <View style={styles.container}>
        <Text style={styles.line}>From: {from}</Text>
        <Text style={styles.line}>To: {to}</Text>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(explorer_endpoint);
          }}
        >
          <Text style={[styles.line, styles.specialLine]}>hash: {hash}</Text>
        </TouchableOpacity>
        <Text style={styles.line}>amount: {amount}</Text>
        <Text style={styles.line}>gas fee: {maxFeePerGas}</Text>
        <Text style={styles.line}>Status: {status}</Text>
        {!updatingTnxStatus && (
          <TouchableOpacity onPress={refereshTnxStatus}>
            <Text style={styles.specialLine}>Refresh Stutus</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
);
export default Trans;
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
  specialLine: { color: "#16a085", textDecorationLine: "underline" },
});
