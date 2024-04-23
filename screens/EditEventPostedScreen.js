import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import DatePicker from "react-native-modern-datepicker";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function EditEventPosted({ route, navigation }) {
  // données initiales de l'event
  const [initialTitle, setInitialTitle] = useState("");
  const [initialDate, setInitialdate] = useState(null);
  const [initialAddress, setInitialAddress] = useState("");
  const [initialDescription, setInitialDescription] = useState("");
  const [initialSeats, setInitialSeats] = useState(0);

  // nouvelles données modifiées par l'utilisateur
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedSeats, setSelectedSeats] = useState(0);

  let title = "";
  let address = "";
  let description = "";
  let seats = "";
  let date = "";
  // données utilisateur permettant de modifier la sortie
  const user = useSelector((state) => state.user.value);
  const token = user.token;

  // id de la sortie modifiée
  const { itemId } = route.params;

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  // on charge le détail d'un événement existant
  // http://192.168.1.85:3000/events/details/KaW619Nnmu3uQumt5BXdhFiVNv4IWyg7/66212b832521125fb1175e8d
  useEffect(() => {
    fetch(`${BACKEND_URL}/events/details/${token}/${itemId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setInitialTitle(data.event.title);
          setInitialdate(data.event.date);
          setInitialAddress(data.event.address);
          setInitialDescription(data.event.description);
          setInitialSeats(data.event.seats);
        }
      });
  }, []);
  // à faire :

  //écrire le nb intial de places dans le détail de l'événement (?) ou quand on veut le modifier
  // avoir une modale qui apparaît sur les éléments modifiables par dropdown ou calendrier donc : le nb de places et la date

  const handleModify = () => {
    // mise à jour de la sortie
    // 66212b832521125fb1175e8d
    // http://192.168.1.85:3000/events/KaW619Nnmu3uQumt5BXdhFiVNv4IWyg7/66212b832521125fb1175e8d
    // soit on a modifié les champs, soit ils prennent la valeur présente dans la BDD
    if (selectedDate) {
      date = selectedDate;
    } else {
      date = initialDate;
    }

    if (selectedTitle) {
      title = selectedTitle;
    } else {
      title = initialTitle;
    }

    if (selectedAddress) {
      address = selectedAddress;
    } else {
      address = initialAddress;
    }

    if (selectedDescription) {
      description = selectedDescription;
    } else {
      description = initialDescription;
    }

    if (selectedSeats) {
      seats = selectedSeats;
    } else {
      seats = initialSeats;
    }

    fetch(`${BACKEND_URL}/events/${token}/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        date,
        address,
        description,
        seats,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          alert("Félicitations, votre sortie a bien été modifiée");
          navigation.navigate("MyEvents");
        }
      });
  };

  //Nombre participants//
  const numberSeats = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },
    { label: "8", value: 8 },
  ];

  const handleCancel = () => {
    navigation.navigate("MyEvents");
  };
  // Formater les dates
  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleDateString("fr-FR", options);
  };

  // Date et heure actuelle
  const localDate = formatDateTime(new Date());
  // Pour le datepicker
  const minimumDate =
    localDate.slice(6, 10) +
    "-" +
    localDate.slice(3, 5) +
    "-" +
    localDate.slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity
          style={styles.back}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("MyEvents")}
        >
          <FontAwesome name="arrow-left" size={20} color="#263238" />
        </TouchableOpacity>

        <Text style={styles.title}>Je modifie une sortie</Text>
        <Text style={styles.text}>
          Titre actuel: {initialTitle} ({title.length}/30 caractères)
        </Text>
        <TextInput
          placeholder="Nouveau titre de la sortie"
          autoCapitalize="none"
          onChangeText={(value) => setSelectedTitle(value)}
          value={selectedTitle}
          style={styles.input}
          maxLength={30}
        />
        <Text style={styles.text}>
          Nb de participants max actuel : {initialSeats}
        </Text>
        <Dropdown
          style={styles.dropdown}
          placeholder="Nombre de participants maximum"
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={numberSeats}
          maxHeight={300}
          labelField="label"
          valueField="value"
          onChange={(item) => setSelectedSeats(item.value)}
          value={selectedSeats}
        />
        <Text style={styles.text}>Ville actuelle : {initialAddress}</Text>
        <TextInput
          placeholder="Ville"
          autoCapitalize="none"
          onChangeText={(value) => setSelectedAddress(value)}
          value={selectedAddress}
          style={styles.input}
          maxLength={50}
        />
        <Text style={styles.text}>
          Description actuelle : ({description.length}/100 caractères)
        </Text>
        <Text style={styles.text}>{initialDescription}</Text>
        <TextInput
          placeholder="Description"
          autoCapitalize="none"
          onChangeText={(value) => setSelectedDescription(value)}
          value={selectedDescription}
          style={styles.input}
          maxLength={100}
        />
        {/* // datepicker */}
        <Text style={styles.text}>Date actuelle : {initialDate}</Text>
        <DatePicker
          onSelectedChange={(date) => setSelectedDate(date)}
          options={{
            selectedTextColor: "#FFF",
            mainColor: "#6C5CE7",
          }}
          minimumDate={minimumDate} // à définir !!!
        />

        <TouchableOpacity
          onPress={() => handleModify()}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Enregistrer les modifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleCancel()}
          style={styles.cancelbutton}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "left",
    // justifyContent: "center",
    justifyContent: "space-between", // remplacé pour aérer
    width: "100%",
    height: "100%",
    // marginLeft: 30,
    paddingHorizontal: 20,
  },
  back: {
    width: 50,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E1E3E6",
  },

  image: {
    width: "100%",
    height: "50%",
  },
  title: {
    fontSize: 34, //as per figma//
    fontWeight: "500", //as per figma//
    marginTop: 20,
  },

  text: {
    fontSize: 20, // passage à 30
  },
  input: {
    // fait
    width: 300,
    height: 50, // au lieu de 50
    borderColor: "#E1E3E6",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    // paddingVertical: 10,
    fontSize: 20, // agrandie
    margin: 10,
  },
  button: {
    // fait
    backgroundColor: "#6C5CE7",
    borderRadius: 8,
    width: 200, // au lieu de 300
    height: 100,
    alignSelf: "center",
    padding: 5,
    marginBottom: 20, // rajouté pour aérer
  },
  cancelbutton: {
    // fait
    backgroundColor: "#6C5CE7",
    borderRadius: 8,
    width: 200, // au lieu de 300
    height: 50,
    alignSelf: "center",
    marginBottom: 20, // rajouté pour aérer
  },
  buttonText: {
    // fait
    color: "#FFF",
    fontSize: 25, // passage à 25
    alignSelf: "center", // rajout
    padding: 10, // rajout
  },
  error: {
    marginTop: 10,
    color: "red",
  },
  dropdown: {
    alignItems: "left",
    margin: 8, // réduite au lieu de 16
    height: 30, // 30
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    fontSize: 20,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    // left: 22,
    // top: 8,
    // zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 20,
  },
  datePickerStyle: {
    width: 150,
    marginTop: 10,
    marginBottom: 0,
  },
});
