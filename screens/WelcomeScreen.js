import React from "react";
//Import components react native//
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
//Stylesheet//
import { StyleSheet } from "react-native";
//Icon Arrow//
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

//To do list:
//1) Import OpenSans
//2) arrow to put again

export default function WelcomeScreen({ navigation }) {
  const handleSignIn = () => {
    navigation.navigate("SignIn");
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Could be added an image free of access? */}
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
      <TouchableOpacity
        style={styles.registerbtn}
        activeOpacity={0.8}
        onPress={() => handleSignUp()}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.registerText}>Inscription</Text>
          <FontAwesomeIcon style={styles.arrow1} name="arrow-right" />
        </View>
      </TouchableOpacity>
      <Text style={styles.texte2}>Déjà un compte ?</Text>
      <TouchableOpacity
        style={styles.loginbtn}
        activeOpacity={0.8}
        onPress={() => handleSignIn()}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.loginText}>Connexion</Text>
          <FontAwesomeIcon style={styles.arrow2} name="arrow-right" />
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

//CSS Style//
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center", //centre tout//
    //fontFamily: "Cochin", //to import open sans//
  },
  title: {
    marginTop: 150, //décale composant vers bas//
    textAlign: "center",
  },
  titleLine: {
    fontSize: 36, //as per figma//
    fontWeight: "600", //as per figma//
    textAlign: "center", //centre au milieu//
    textAlign: "center",
  },
  subtitle: {
    fontSize: 24, //as per figma//
    paddingTop: 25, //espace composant du titre//
    textAlign: "center",
  },
  subtitleLine: {
    fontSize: 24, //as per figma//
    textAlign: "center", //centrer les deux lignes au milieu//
  },
  registerbtn: {
    backgroundColor: "#6C5CE7", //as per figma//
    height: 50, //as per figma//
    width: 300, //as per figma//
    alignItems: "center", //pour centrer txt//
    justifyContent: "center", //idem//
    marginTop: 10, //pour espacement//
    borderRadius: 10, //as per figma - trial//
    shadowColor: "grey", //grey or black ??// //for IOS//
    shadowOpacity: 0.8, //fait apparait shadow//
    shadowRadius: 2, //epaisseur shadow//
    shadowOffset: {
      height: 1,
      width: 1,
    },
    elevation: 1, //for android only//
  },
  register: {
    color: "white", //as per figma//
    fontWeight: "600", //as per figma//
    fontSize: 20, //as per figma//
  },
  loginbtn: {
    backgroundColor: "white", //as per figma//
    height: 50, //as per figma//
    width: 300, //as per figma//
    alignItems: "center", //pour centrer texte within//
    justifyContent: "center", //idem//
    marginTop: 10, //pour espacement//
    borderRadius: 10, //as per figma - trial//
    shadowColor: "grey", //grey or black ??//
    shadowOpacity: 0.8, //fait apparait shadow//
    shadowRadius: 2, //epaisseur shadow//
    shadowOffset: {
      height: 1,
      width: 1,
    },
    elevation: 2,
  },
  loginText: {
    color: "#6C5CE7", //as per figma//
    fontWeight: "600", //as per figma//
    fontSize: 20, //as per figma//
  },
  buttonContent: {
    flexDirection: "row", //dans le but espacer txt et fleche//
    alignItems: "center", //centre fleche//
  },
  registerText: {
    color: "white", //as per figma//
    fontWeight: "600", //as per figma//
    fontSize: 20, //as per figma//
  },
  arrow1: {
    marginLeft: 30, // as per figma//
    color: "white", //as per figma//
  },
  arrow2: {
    marginLeft: 30, // as per figma//
    color: "#6C5CE7", //as per figma//
  },
  texte1: {
    fontSize: 14, //as per figma//
    paddingTop: 80, //pour espacement//
    width: 300,
  },
  texte2: {
    fontSize: 14, //as per figma//
    paddingTop: 50, //pour espacement//
    width: 300,
  },
});
