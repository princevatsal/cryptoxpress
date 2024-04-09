import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Send } from "../../icons/appIcon";
import { Link } from "expo-router";
export default function Acc({ acc, index, onPress = () => {} }) {
  console.log(acc);
  return (
    <Link
      href={{
        pathname: "/Account/[acc_id,key]",
        params: { acc_id: acc.address, key: acc.key },
      }}
      asChild
    >
      <TouchableOpacity style={styles.row} onPress={onPress}>
        <View style={styles.circle}>
          <Text style={styles.index}>{index}</Text>
        </View>
        <Text style={styles.acc_no}>{acc.address}</Text>
        <Image source={Send} style={styles.send} />
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 12,
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: "2%",
    borderRadius: 5,
    backgroundColor: "#efeff0",
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  acc_no: {
    fontWeight: "500",
    width: "70%",
  },
  circle: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#16a085",
    height: 25,
    width: 25,
    borderRadius: 25,
    marginRight: 7,
  },
  index: {
    color: "#fff",
    fontWeight: "500",
  },
  send: {
    height: 40,
    width: 40,
  },
});
