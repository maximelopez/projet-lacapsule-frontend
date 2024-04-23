import React from "react";
//Import components react native//
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
//Hooks/states
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//Date picker//
import DatePicker from "react-native-modern-datepicker";
//Icons//
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
//Import dropdown list
import { MultipleSelectList } from "react-native-dropdown-select-list";
//Image picker//
import * as ImagePicker from "expo-image-picker";

export default function ProfileCreationScreen({ navigation }) {
  //Set DOB//
  const [dob, setDOB] = useState("");
  //Set profile picture
  const [image, setImage] = useState(null);
  //Date picker
  const dispatch = useDispatch();
  //For selection activities
  const [selected, setSelected] = useState("");
  const [activity, setActivity] = useState("");
  // user selection with email
  const user = useSelector((state) => state.user.value);
  // const [favoriteCategories, setFavoriteCategories] = useState("");
  const token = user?.token;
  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  // const [category, setCategory] = useState("");

  const dataCategory = [
    { key: "1", value: "Bar" },
    { key: "2", value: "Restaurant" },
    { key: "3", value: "Tricot" },
    { key: "4", value: "Théâtre" },
    { key: "5", value: "Sport" },
    { key: "6", value: "Pêche à la mouche" },
    { key: "7", value: "Cinéma" },
    { key: "8", value: "Voyage" },
    { key: "8", value: "Autre" },
  ];
  // route get categories : prend en entrée/params l'iD
  // et donne en sortie true et le nom de la catégorie
  // http://192.168.1.85:3000/categories/661cdd0683ff965dd762ca9b
  useEffect(() => {
    fetch(`${BACKEND_URL}/users/print/${token}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data.result) {
          // if (data.avatar) {
          //   setImage(data.avatar);
          //   // console.log(user.avatar);
          // } else setImage("");
          if (data.dateOfBirth) {
            setDOB(data.dateOfBirth.slice(0, 10));
          } else {
            // setDOB(new Date());
            setDOB("2024-10-02");
          }
          if (data.favoriteCategories) {
            // setFavoriteCategories(data?.favoriteCategories);
            favoriteCategories = data?.favoriteCategories;
            console.log(favoriteCategories, "ligne 75"); // OK après un rechargement de la page
            // on va chercher la catégorie dans le fetch pour avoir son nom
            // let _id = favoriteCategories; // on va garder cet ID pour la suite
            //http://192.168.1.85:3000/categories/661cdd0683ff965dd762ca9b
            fetch(`${BACKEND_URL}/categories/${favoriteCategories}`)
              // fetch(`${BACKEND_URL}/categories/662127f92521125fb1175e68`)
              .then((response) => response.json())
              .then((data) => {
                console.log(data, "data");
                if (data.result) {
                  setActivity(data.name);
                  console.log(data, "ligne 86");
                  // console.log("activity", activity); // pas converti encore ici car fait un rerender de la page !
                } else {
                  // console.log("category not found");
                  setActivity("");
                }
              });
          } else {
            setActivity("");
          }
        } else {
          alert("Vous devez vous reconnecter pour modifier votre profil");
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

    console.log("Image picker result", result.assets[0]);
    if (!result.canceled) {
      const formData = new FormData();
      formData.append("avatar", {
        uri: result.assets[0].uri,
        name: `photo.jpg`,
        type: result.assets[0].mimeType,
      });
      try {
        //fetch route//
        await fetch(`${BACKEND_URL}/users/addPicture/${token}`, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            //stocke données
            if (data.result) {
              // Mettre à jour l'URI de l'image dans l'état image
              setImage(data.result);
            }
          });
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  //To do list :
  //1) To create function if signup succeeds, redirect to profile creation//
  //2) Send results to profile//
  //3) Valider resultats si rempli ? et passer à sorties du jour//
  // en cours de modif
  //
  //
  //http://192.168.1.85:3000/users/modify/KaW619Nnmu3uQumt5BXdhFiVNv4IWyg7
  const handleValidate = () => {
    // setCategory(selected[0]);
    // essai pas de set ici
    let category = selected[0];
    console.log(selected[0], "ligne 125");
    if (selected.length > 1) {
      alert("1 seule activité favortie autorisée svp");
    } else {
      fetch(`${BACKEND_URL}/users/modify/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          avatar: image,
          category, // le nom de l'activité :!!!!
          dateOfBirth: dob,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            setActivity(category);
            alert("profil correctement mis à jour !");
            navigation.navigate("TabNavigator", { screen: "Profile" });
          } else {
            alert("raté !");
          }
        });
    }
  };
  console.log(selected[0]);
  //
  const handleCancel = () => {
    navigation.navigate("TabNavigator", { screen: "Profile" });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView>
        <ScrollView>
          <Text style={styles.title}>
            <Text style={styles.titleLine}>Création ou modification</Text>
            {"\n"}
            <Text style={styles.titleLine}>de mon profil</Text>
          </Text>
          {/* Show new pic once selected */}
          <View style={styles.changepic}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.profilepicture}
                width={100}
                height={100}
                value={image}
              />
            ) : (
              <FontAwesomeIcon
                style={styles.profilepicture}
                name="user"
                size={70}
                color={"#6C5CE7"}
              />
            )}
            <Text style={styles.changeText} onPress={pickImage}>
              Changer ma photo
            </Text>
          </View>
          <View style={styles.calendar}>
            <Text style={styles.dob}>Date de naissance : {dob} </Text>
            <DatePicker
              onSelectedChange={(date) => setDOB(date)}
              options={{
                mainColor: "#6C5CE7",
                borderColor: "#6C5CE7",
                selectedTextColor: "#fff",
              }}
              mode="calendar"
              value={dob} // mettre la date provenant de la BDD ??
            />
          </View>
          <View style={styles.act}>
            <Text style={styles.activites}>
              Activité préférée:{"  "} {activity}
            </Text>
            <MultipleSelectList
              style={styles.list}
              setSelected={(val) => setSelected(val)}
              // déjà écrit en haut donc doublon label="Activités Préférées"
              data={dataCategory}
              placeholder="sélectionne une activité"
              save="value"
              search={false} //enleve recherche avec clavier//
              badgeStyles={{ backgroundColor: "#6C5CE7" }} //couleur catégories selected//
              onSelect={() => alert(selected)}
            ></MultipleSelectList>
          </View>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => handleValidate()}
          >
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => handleCancel()}
          >
            <Text style={styles.buttonText}>Retour au profil</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

//CSS Style//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    // fontFamily: "Cochin", //to import open sans//
  },
  title: {
    marginTop: 50, //décale composant vers bas//
    marginBottom: 20,
    textAlign: "center",
  },
  titleLine: {
    fontSize: 36, //as per figma//
    fontWeight: "600", //as per figma//
    textAlign: "center", //centre au milieu//
    textAlign: "center",
  },
  list: {
    fontSize: 20,
  },
  titleLine: {
    fontSize: 34, //police autres ecrans//
    fontWeight: "500", //police autres ecrans//
    textAlign: "center", //centre tout le texte//
    alignSelf: "center",
  },
  changepic: {
    flexDirection: "row", // Alignement horizontal
    alignItems: "center", // Aligner les éléments verticalement
    marginLeft: 25, // Décalage vers la droite
    marginBottom: 15, //espacement bloc
  },
  profilepicture: {
    marginTop: 5, // Décalage vers le bas
    marginRight: 10, // Décalage vers la droite
  },
  changeText: {
    fontSize: 18, // Taille de la police
    marginLeft: 40, //espacer icone et texte//
  },
  input: {
    width: 300,
    height: 50,
    borderColor: "#E1E3E6",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 35, //decalage vers bas//
    marginLeft: 25, //decalage vers droite//
  },
  activites: {
    paddingBottom: 10, //espacer nom et liste//
    fontSize: 20,
    color: "#6C5CE7",
    marginTop: 15,
  },
  act: {
    paddingLeft: 25, // Décalage vers la droite
    width: 320, //Reduit largeur//
  },
  calendar: {
    alignItems: "center", //centre bloc//
    paddingTop: 10, // espace avec bloc precedent//
  },
  dob: {
    paddingTop: 15, //espacer avec calendrier//
    fontSize: 18,
  },
  button: {
    backgroundColor: "#6C5CE7",
    borderRadius: 8,
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 25, // Décalage vers la droite
    marginTop: 10, //espace entre liste et bouton//
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
  },
});
