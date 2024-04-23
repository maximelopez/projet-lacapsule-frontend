import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Redux
import { useDispatch } from "react-redux";
import { login } from "../reducers/user";

export default function SignUp({ navigation }) {
  const dispatch = useDispatch();

  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const handleSubmit = () => {
    // Enregistrement de l'utilisateur en base de données
    fetch(BACKEND_URL + "/users/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        firstname: firstname,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(
            login({
              token: data.token,
              id: data.id,
              firstname: data.firstname,
              email: data.email,
            })
          );
          setFirstname("");
          setEmail("");
          setPassword("");
          setError("");
          navigation.navigate("ProfileCreation");
        } else {
          setError(data.error);
        }
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.back}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("Welcome")}
      >
        <FontAwesome name="arrow-left" size={20} color="#263238" />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>Inscription</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={firstname}
            onChangeText={(value) => setFirstname(value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={(value) => setEmail(value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={(value) => setPassword(value)}
          />
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => handleSubmit()}
          >
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  back: {
    marginTop: 50,
    marginLeft: 20,
    width: 80,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E1E3E6",
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 36, //as per figma//
    fontWeight: "600", //as per figma//
    marginTop: 40,
    marginBottom: 80,
  },
  inputContainer: {
    gap: 30,
  },
  input: {
    width: 300,
    height: 50,
    borderColor: "#E1E3E6",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: "#6C5CE7",
    borderRadius: 8,
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
  },
  error: {
    color: "#F43C3C",
    width: 300,
    marginBottom: 10,
    marginLeft: 10,
  },
});
