import { StyleSheet, Text, View } from "react-native";
import AppButton from "../moleculer/AppButton";
import { Bitcoin, Polygon } from "../../icons/appIcon";
import { useStore } from "../../state/store";
import { observer } from "mobx-react-lite";
const Switch = observer(() => {
  const { network, toggleNetwork } = useStore();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Switch Network</Text>
      <AppButton
        title={network}
        leftIcon={network === "polygon" ? Polygon : Bitcoin}
        onPress={toggleNetwork}
      />
    </View>
  );
});
export default Switch;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
    marginRight: 10,
    color: "grey",
  },
});
