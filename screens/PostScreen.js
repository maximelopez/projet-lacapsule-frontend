import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import DatePicker from "react-native-modern-datepicker";
import { useState } from "react";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { addEvent } from "../reducers/events";
import { addEventCreated } from "../reducers/user";

export default function PostScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [seats, setSeats] = useState(0);

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const handleSubmit = () => {
    // alerte si tous les champs ne sont  pas remplis //
    if ( !title || !category || !selectedDate || !city || !description || !seats ) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    fetch(`${BACKEND_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        token: user.token, 
        title: title, 
        category: category, 
        selectedDate: new Date(formatedDate), 
        city: city.trim(),
        description: description, 
        seats: seats })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setTitle("");
          setCategory("");
          setCity("");
          setDescription("");
          setSelectedDate("");
          setSeats(0);
          dispatch(addEventCreated(data.event));
          dispatch(addEvent(data.event));
          navigation.navigate("TabNavigator", { screen: "MyEvents" });
        }
      });
  };

  // Dans un second temps récupérer les catégoriess de la bdd
  const categoryList = [
    { label: "Bar", value: "Bar" },
    { label: "Restaurant", value: "Restaurant" },
    { label: "Musée", value: "Musée" },
    { label: "Sport", value: "Sport" },
    { label: "Voyage", value: "Voyage" },
    { label: "Autre", value: "Autre" },
  ];

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

  // Format de date pour la bdd : new Date(2024-04-19T19:30:00.000Z)
  const formatedDate =
    selectedDate.slice(0, 4) +
    "-" +
    selectedDate.slice(5, 7) +
    "-" +
    selectedDate.slice(8, 10) +
    "T" +
    selectedDate.slice(11, 13) +
    ":" +
    selectedDate.slice(14, 16) +
    ":00.000Z";

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
    <View style={styles.container}>
      <Text style={styles.title}>Publier une sortie</Text>
      <ScrollView>
        <View style={styles.inputList}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Titre"
              onChangeText={(value) => setTitle(value)}
              value={title}
              style={styles.input}
              maxLength={30}
              selectionColor="#0077B6"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Description"
              onChangeText={(value) => setDescription(value)}
              value={description}
              style={styles.input}
              maxLength={100}
              selectionColor="#0077B6"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Ville"
              onChangeText={(value) => setCity(value)}
              value={city}
              style={styles.input}
              maxLength={50}
              selectionColor="#0077B6"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.text}>Catégorie :</Text>
            <Dropdown
              style={styles.dropdown}
              placeholder="Sélectionner"
              data={categoryList}
              maxHeight={300}
              labelField="label"
              valueField="value"
              onChange={(item) => setCategory(item.value)}
              value={category}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.text}>Nombre de participants :</Text>
            <Dropdown
              style={styles.dropdown}
              placeholder="Sélectionner"
              data={numberSeats}
              maxHeight={300}
              labelField="label"
              valueField="value"
              onChange={(item) => setSeats(item.value)}
              value={seats}
            />
          </View>

          <DatePicker
            style={styles.datepicker}
            options={{
              mainColor: "#0077B6",
              selectedTextColor: "#fff",
            }}
            minimumDate={minimumDate}
            onSelectedChange={(date) => setSelectedDate(date)}
          />

          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Publier</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  inputList: {
    alignItems: "center",
  },
  inputContainer: {
    marginTop: 20,
  },
  text: {
    fontSize: 16,
  },
  input: {
    width: 300,
    height: 50,
    borderColor: "#E1E3E6",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#0077B6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    width: 200,
    height: 50,
    alignSelf: "center",
    marginBottom: 40,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
  },
  dropdown: {
    width: 300,
    margin: 8,
    height: 30,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    fontSize: 18,
  },
  datepicker: {
    marginTop: 20,
  },
});
