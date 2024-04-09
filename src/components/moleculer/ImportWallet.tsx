import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useEffect, useState } from "react";

import { useStore } from "../../state/store";
import { observer } from "mobx-react-lite";
import AppButton from "./AppButton";
import { getBitcoinAddressFromKey } from "../../API/Resources";
import { getAddressFromKey } from "../../Utils/ether";

const ImportWallet = observer(() => {
  const [privateKey, setPrivateKey] = useState("");
  const {
    network,
    addBitcoinAddress,
    bitcoinAddresses,
    addPolygonAddress,
    polygonAddresses,
  } = useStore();

  const importBitcoinWallet = async () => {
    if (privateKey.trim() === "") {
      alert("Please provide a private key");
      return;
    }
    const address = await getBitcoinAddressFromKey(privateKey);
    if (!address || address === "invalid_key") {
      alert("Invalid key");
      return;
    }
    if (bitcoinAddresses.findIndex((add) => add == address) != -1) {
      alert("Account already exist");
      return;
    }
    addBitcoinAddress(address, privateKey);
    setPrivateKey("");
  };
  const importPolygonWallet = async () => {
    if (privateKey.trim() == "") {
      alert("Please enter private key");
      return;
    }
    const address = getAddressFromKey(privateKey);
    if (!address || address.trim() === "") {
      alert("please enter a valid address");
      return;
    }
    if (polygonAddresses.findIndex((add) => add == address) != -1) {
      alert("Account already exist");
      return;
    }
    addPolygonAddress(address, privateKey);
    setPrivateKey("");
  };

  useEffect(() => {
    setPrivateKey("");
  }, [network]);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Import {network === "polygon" ? "Polygon" : "Bitcoin"} Wallet
      </Text>
      <View style={styles.wrapper}>
        <TextInput
          value={privateKey}
          onChangeText={setPrivateKey}
          style={styles.input}
          placeholder="Enter your Private Key"
        />
        <AppButton
          leftIcon={null}
          title={"Import"}
          btnStyles={styles.importBtn}
          textStyles={styles.importBtnTxt}
          onPress={
            network === "polygon" ? importPolygonWallet : importBitcoinWallet
          }
        />
      </View>
    </View>
  );
});
export default ImportWallet;

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "3%",
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 15,
  },
  wrapper: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  input: {
    fontSize: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 50,
    width: "80%",
    borderColor: "grey",
    fontWeight: "500",
  },
  importBtn: {
    backgroundColor: "#16a085",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontWeight: "200",
  },
  importBtnTxt: {
    fontWeight: "500",
    fontSize: 17,
    color: "#fff",
  },
});
