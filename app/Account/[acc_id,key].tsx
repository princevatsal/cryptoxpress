import { StyleSheet, Text, View, TextInput, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import AppButton from "../../src/components/moleculer/AppButton";
import { getBalance, sendMatic } from "../../src/Utils/ether";
import { observer } from "mobx-react-lite";
import { useStore } from "../../src/state/store";
import Trans from "../../src/components/atomic/Trans";
const Account = observer(() => {
  const { acc_id, key } = useLocalSearchParams();
  const { network, addPolygonTrans, polygonTrans, bitcoinTrans } = useStore();
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("0");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchBalance = async () => {
      if (network === "polygon") {
        const balance = await getBalance(acc_id);
        setBalance(balance);
      }
    };
    fetchBalance();
  }, [acc_id]);
  const sendMAticCoin = async () => {
    try {
      const response = await sendMatic(key, receiverAddress, amount);
      setLoading(false);
      if (response.status === "error") {
        alert(response.msg);
      }
      if (response.status === "success") {
        alert("Sent");
        addPolygonTrans(
          response.tx.from,
          response.tx.to,
          response.tx.hash,
          amount
        );
        setAmount("0");
        setReceiverAddress("");
      }
    } catch {}
  };
  const sendToken = async () => {
    if (loading) return;
    if (receiverAddress.trim() === "") {
      alert("Please enter a reciever address");
      return;
    }
    if (amount > balance || !amount) {
      alert("Please enter a amount less than balance");
      return;
    }
    if (network === "polygon") {
      setLoading(true);
      await sendMAticCoin();
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Account: {acc_id}</Text>
      <View style={styles.content}>
        <Text style={styles.balance}>
          Balance:-{" "}
          <Text style={styles.value}>
            {balance ?? "..."} {network === "polygon" ? "MATIC" : "BTC"}
          </Text>
        </Text>
        <Text style={styles.sendTxt}>
          Send {network === "polygon" ? "MATIC" : "BTC"}
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
            placeholder="Amount"
            value={amount}
            onChangeText={(e) => {
              setAmount(e);
            }}
          />
          <AppButton
            title={loading ? "....." : "Send"}
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
              />
            )}
          />
        </View>
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
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
  },
  value: {
    color: "#16a085",
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
});
