import { StyleSheet, Text, View } from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

export default function ProfileScreen({ navigation }) {

  return (
    <View style={styles.container}>
      <Text>ProfileScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
