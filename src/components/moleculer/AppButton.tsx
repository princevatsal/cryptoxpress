import { StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

export default function AppButton({
  title,
  onPress,
  leftIcon,
  btnStyles = {},
  textStyles = {},
}) {
  return (
    <TouchableOpacity style={[styles.button, btnStyles]} onPress={onPress}>
      {leftIcon && <Image source={leftIcon} style={styles.leftIcon} />}
      <Text style={[styles.title, textStyles]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#efeff0",
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 5,
    elevation: 2,
  },
  leftIcon: {
    height: 33,
    width: 33,
    marginRight: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: "500",
  },
});
