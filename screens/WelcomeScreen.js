import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen({ navigation }) {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Text style={styles.titleLine}>Bienvenue</Text>
        {"\n"}
        <Text style={styles.titleLine}>sur Break Out !</Text>
      </Text>
      <Text style={styles.subtitle}>
        <Text style={styles.subtitleLine}>L'application qui te permet</Text>
        {"\n"}
        <Text style={styles.subtitleLine}>de sortir de chez toi.</Text>
      </Text>
      <Text style={styles.texte1}>
        Pas encore membre ? L'inscription c'est par ici !
      </Text>
      <TouchableOpacity style={styles.registerbtn} activeOpacity={0.8} onPress={() => navigation.navigate("SignUp")}>
        <View style={styles.buttonContent}>
          <Text style={styles.registerText}>Inscription</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.texte2}>Déjà un compte ?</Text>
      <TouchableOpacity style={styles.loginbtn} activeOpacity={0.8} onPress={() => navigation.navigate("SignIn")}>
        <View style={styles.buttonContent}>
          <Text style={styles.loginText}>Connexion</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
  },
  title: {
    marginTop: 100,
    textAlign: "center",
  },
  titleLine: {
    fontSize: 36,
    fontWeight: "600",
    textAlign: "center",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 24,
    paddingTop: 25,
    textAlign: "center",
  },
  subtitleLine: {
    fontSize: 24,
    textAlign: "center",
  },
  registerbtn: {
    backgroundColor: "#6C5CE7",
    height: 50,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 10,
  },
  register: {
    color: "white",
    fontWeight: "600",
    fontSize: 20,
  },
  loginbtn: {
    backgroundColor: "white",
    height: 50,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#6C5CE7",
  },
  loginText: {
    color: "#6C5CE7",
    fontWeight: "600",
    fontSize: 20,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  registerText: {
    color: "white",
    fontWeight: "600",
    fontSize: 20,
  },
  texte1: {
    fontSize: 14,
    paddingTop: 80,
    width: 300,
  },
  texte2: {
    fontSize: 14,
    paddingTop: 50,
    width: 300,
  },
});
