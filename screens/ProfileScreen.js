import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
//Icons//
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
//Image picker//
// import * as ImagePicker from "expo-image-picker";
// Redux
import { logout } from "../reducers/user";

//A ne plus modifier//
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  //Récupérer données utilisateur (pour suppression ou affichage profil)//
  const user = useSelector((state) => state.user.value);
  const token = user.token;
  //Update profile picture, age & category//
  const [image, setImage] = useState(null);
  const [age, setAge] = useState(0); //calculé plus bas dans le useEffect/ fetch
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetch(`${BACKEND_URL}/users/print/${token}`) // route d'affichage des données utilisateur
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          if (data.avatar) {
            setImage(data.avatar);
          }
          if (data.dateOfBirth) {
            // setDOB(data.dateOfBirth.slice(0, 10));
            let dob = data.dateOfBirth.slice(0, 10);
            // calcul de l'âge de l'utilisateur
            let today = new Date();
            // le "?" est important pour qu'il n'y ait pas de bug
            let an = dob?.substr(0, 4); // l'année (les quatre premiers caractères de la chaîne à partir de 0)
            let mois = dob?.substr(5, 2); // On selectionne le mois de la date de naissance
            let day = dob?.substr(8, 2); // On selectionne la jour de la date de naissance
            // calcul du nb d'années max
            an = today.getFullYear() - an;
            let m = today.getMonth() - mois;
            // ajustement du nb d'années si la date anniversaire n'est pas encore arrivée
            if (m < 0 || (m === 0 && today.getDate() < day)) {
              an = an - 1;
              setAge(an);
            } else {
              setAge(an);
            }
          }
          if (data.favoriteCategories) {
            // on va chercher la catégorie
            // setFavoriteCategories(data.favoriteCategories);
            favoriteCategories = data.favoriteCategories;
            let _id = data.favoriteCategories;
            fetch(`${BACKEND_URL}/categories/${_id}`)
              .then((response) => response.json())
              .then((data) => {
                if (data.result) {
                  setCategory(data.name);
                } else {
                  console.log("category not found");
                }
              });
          } else {
            setCategory("");
          }
        } else {
          console.log("user not found");
        }
      });
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  //Deconnection compte//
  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate("Welcome");
  };

  //Modification compte//
  const handleModify = () => {
    navigation.navigate("ProfileCreation");
  };

  //Suppression compte//
  const handleDeleteAccount = () => {
    // Vérifier si le token utilisateur est disponible
    if (user.token) {
      // Configurer les options de la requête
      // Envoyer la requête de suppression vers le backend
      fetch(`${BACKEND_URL}/users/remove/${token}`, {
        method: "DELETE",
      })
        .then((response) => {
          // Vérifier le statut de la réponse
          if (response.ok) {
            // dispatch(deleteAccount());
            // Si la suppression réussit, afficher un message à l'utilisateur et naviguer vers la page d'accueil
            alert("Compte supprimé avec succès");
            dispatch(logout());
            dispatch(logout());
            navigation.navigate("Welcome");
          } else {
            // Gérer d'autres codes de statut d'erreur
            throw new Error("Erreur lors de la suppression du compte");
          }
        })
        .catch((error) => {
          // Gérer les erreurs de réseau ou de serveur
          console.error("Erreur de suppression du compte:", error.message);
          alert("Erreur lors de la suppression du compte");
        });
    } else {
      alert(
        "Vous n'êtes pas dans la base de données, donc votre compte ne peut être supprimé. Désolé.e.s"
      );
    }
  };
  const handleMapEvents = () => {
    navigation.navigate("MyEventsVersionMap");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView>
        <Text style={styles.title}>Mon profil</Text>
        <Text style={styles.firstname}>Prénom : {user.firstname}</Text>
        <View style={styles.picture}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.profilepicture}
              width={100}
              height={100}
              value={image} // mettre l'image provenant de la BDD
            />
          ) : (
            <FontAwesomeIcon
              style={styles.profilepicture}
              name="user"
              size={70}
              color={"#6C5CE7"}
            />
          )}

          {/* <Text style={styles.photochange} onPress={pickImage}>
            Changer ma photo
          </Text> */}
        </View>
        <Text style={styles.age}>Âge : {age} ans</Text>

        <View style={styles.favoritecat}>
          <Text style={styles.activites}>Activité préférée : {category}</Text>
          {/* affichage catégorie */}
        </View>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => handleMapEvents()}
        >
          <Text style={styles.buttonText}>Carte des sorties</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => handleModify()}
          >
            <Text style={styles.buttonText}>Modifier le profil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => handleLogout(navigation)}
          >
            <Text style={styles.buttonText}>Se déconnecter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => handleDeleteAccount()}
          >
            <Text style={styles.buttonText}>Supprimer son compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 34, //as per figma//
    fontWeight: "500", //as per figma//
    marginTop: 50, //espacement pour decaler titre//
    marginBottom: 80,
    alignSelf: "center",
  },
  firstname: {
    marginBottom: 150,
    marginRight: 250,
    fontSize: 20, // as per figma
    fontWeight: "500", //as per figma
  },
  picture: {
    marginLeft: 250,
    marginTop: -200, //pour remonter bloc//
    alignItems: "center",
  },
  photochange: {
    color: "grey", //as per figma
    fontSize: 16, // as per figma
    fontWeight: "500", //as per figma
  },
  age: {
    marginRight: 250,
    fontSize: 20, // as per figma
    fontWeight: "500", //as per figma
  },
  containerpastevents: {
    marginTop: 35,
    marginRight: 50,
    width: "80%",
    backgroundColor: "#FDA9A9", //as per figma//
  },
  pastevents: {
    fontSize: 20, // as per figma
    fontWeight: "500", //as per figma
  },
  containerfutureevents: {
    marginRight: 50,
    marginTop: 50, //pour espacer blocs//
    width: "80%",
    backgroundColor: "#ECFDA9", //as per figma//
  },
  futureevents: {
    fontSize: 20, // as per figma
    fontWeight: "500", //as per figma
  },
  containerlikedevents: {
    marginRight: 50,
    marginTop: 50, //pour espacer blocs//
    width: "80%",
    backgroundColor: "#D2B8F2", //as per figma//
  },
  likedevents: {
    fontSize: 20, // as per figma
    fontWeight: "500", //as per figma
  },
  favoritecat: {
    marginRight: 50,
    marginTop: 50, //pour espacer blocs//
    width: "80%",
    marginBottom: 80, //espacement//
  },
  activites: {
    fontSize: 20, // as per figma
    fontWeight: "500", //as per figma
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 80, // Ajoutez un espace supplémentaire si nécessaire
  },

  button: {
    backgroundColor: "#6C5CE7",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    height: 50,
    marginRight: 5,
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    justifyContent: "center",
  },
});
