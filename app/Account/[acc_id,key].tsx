import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import AppButton from "../../src/components/moleculer/AppButton";
import { sendBTC, sendUSDT } from "../../src/Utils/ether";
import { observer } from "mobx-react-lite";
import { useStore } from "../../src/state/store";
import Trans from "../../src/components/atomic/Trans";
import { Reload } from "../../src/icons/appIcon";
const Account = observer(() => {
  const { acc_id, key } = useLocalSearchParams();
  const {
    network,
    polygonTrans,
    bitcoinTrans,

    addPolygonTrans,
    addBitcoinTrans,
    balance,
    updateBalance,
    setBalance,
  } = useStore();
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [sendingTokens, setSendingTokens] = useState(false);

  const updateBal = () => {
    setBalance();
    updateBalance(acc_id);
  };
  useFocusEffect(useCallback(updateBal, []));

  const validators = () => {
    if (sendingTokens) return;
    if (receiverAddress.trim() === "") {
      alert("Please enter a reciever address");
      return false;
    }
    if (amount.trim() == "" || Number(amount) > balance || !amount) {
      alert("Please enter a amount less than balance");
      return false;
    }
    return true;
  };

  const addTransaction = (response) => {
    if (network === "polygon")
      addPolygonTrans(
        response.tx.from,
        response.tx.to,
        response.tx.hash,
        amount + " dUSDT",
        response.tx.maxFeePerGas,
        response.tx.status
      );
    else
      addBitcoinTrans(
        response.tx.from,
        response.tx.to,
        response.tx.hash,
        amount + " BTC",
        response.tx.maxFeePerGas,
        response.tx.status
      );
  };
  const sendToken = async () => {
    if (!validators()) {
      return;
    }
    setSendingTokens(true);
    let response;
    if (network === "polygon") {
      response = await sendUSDT(key, receiverAddress, amount);
    } else {
      response = await sendBTC(acc_id, key, receiverAddress, Number(amount));
    }
    if (response?.status === "error") {
      alert(response?.msg);
      setSendingTokens(false);
      return;
    }
    if (response?.status === "success") {
      alert("Sent");
      addTransaction(response);
      setAmount("0");
      setReceiverAddress("");
      setTimeout(() => {
        updateBalance(acc_id);
        setSendingTokens(false);
      }, 4000);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Account: {acc_id}</Text>
      <View style={styles.content}>
        <View style={styles.balance}>
          <Text style={[styles.value, { color: "#000" }]}>Balance:- </Text>
          <Text style={styles.value}>
            {balance ?? "..."} {network === "polygon" ? "dUSDT" : "BTC"}
          </Text>
          <TouchableOpacity onPress={updateBal} style={styles.reloadCover}>
            <Image source={Reload} style={styles.reload} />
          </TouchableOpacity>
        </View>
        <>
          <Text style={styles.sendTxt}>
            Send {network === "polygon" ? "dUSDT" : "BTC"}
          </Text>
          <TextInput
            style={styles.address}
            placeholder="Enter Reciever address"
            value={receiverAddress}
            onChangeText={setReceiverAddress}
          />
          <View style={styles.wrapper}>
            <TextInput
              style={styles.amount}
              keyboardType="numeric"
              placeholder={network === "polygon" ? "dUSDT" : "BTC"}
              value={amount}
              onChangeText={(e) => {
                setAmount(e);
              }}
            />
            <AppButton
              title={sendingTokens ? "....." : "Send"}
              btnStyles={styles.send}
              textStyles={styles.sendTxtBtn}
              onPress={sendToken}
              leftIcon={null}
            />
          </View>
          <Text style={styles.transTxt}>Transactions</Text>
          <View style={styles.flatListCover}>
            <FlatList
              data={network === "polygon" ? polygonTrans : bitcoinTrans}
              renderItem={(item) => (
                <Trans
                  from={item.item.from}
                  to={item.item.to}
                  hash={item.item.hash}
                  amount={item.item.amount}
                  maxFeePerGas={item.item.maxFeePerGas}
                  status={item.item.status}
                />
              )}
            />
          </View>
        </>
      </View>
    </View>
  );
});
export default Account;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  heading: {
    marginHorizontal: "15%",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  content: {
    width: "100%",
    paddingHorizontal: "4%",
  },
  balance: {
    fontWeight: "500",

    textAlign: "center",
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  value: {
    color: "#16a085",
    fontSize: 20,
  },
  sendTxt: {
    marginTop: 40,
    fontWeight: "500",
    fontSize: 17,
  },
  address: {
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 10,
    fontSize: 15,
    paddingVertical: 7,
    paddingHorizontal: 5,
    fontWeight: "600",
  },
  wrapper: {
    flexDirection: "row",
    marginTop: 10,
  },
  amount: {
    width: 150,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontWeight: "600",
  },
  send: {
    backgroundColor: "#16a085",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontWeight: "200",
    marginLeft: 10,
  },
  sendTxtBtn: {
    color: "#fff",
  },
  transTxt: {
    marginTop: 20,
    fontWeight: "500",
    fontSize: 17,
    textAlign: "center",
    marginBottom: 20,
  },
  flatListCover: {
    height: "55%",
    width: "100%",
  },
  reload: {
    height: 20,
    width: 20,
  },
  reloadCover: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});
