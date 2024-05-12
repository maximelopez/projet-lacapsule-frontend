import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";

export default function ProfileScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);

  // Charger l'image de le bdd
  let imageUrl = '../assets/images/profile.png';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>
      <Image style={styles.image} source={require(`${imageUrl}`)} />
      <View>
        <Text style={styles.text}>Nom : {user.firstname}</Text>
        <Text style={styles.text}>Adresse email : {user.email}</Text>
      </View>

      <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => navigation.navigate('Favorites')}>
        <Text style={styles.buttonText}>Mes favoris</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 34,
    fontWeight: "500",
    marginTop: 50,
    alignSelf: "center",
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  text: {
    fontSize: 16,
    marginLeft: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0077B6",
    borderRadius: 8,
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
  },
});
