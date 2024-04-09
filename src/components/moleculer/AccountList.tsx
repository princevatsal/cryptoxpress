import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../state/store";
import Acc from "../atomic/Acc";

const AccountList = observer(() => {
  const { bitcoinAddresses, polygonAddresses, network } = useStore();
  console.log(bitcoinAddresses);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {network === "polygon" ? "Polygon" : "Bitcoin"} Accounts
      </Text>
      {(network === "polygon" ? polygonAddresses : bitcoinAddresses).map(
        (acc, index) => (
          <Acc acc={acc} index={index + 1} />
        )
      )}
    </View>
  );
});
export default AccountList;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: "100%",
    paddingHorizontal: "5%",
  },
  text: {
    fontWeight: "300",
    fontSize: 17,
    textAlign: "center",
    marginBottom: 10,
  },
});
