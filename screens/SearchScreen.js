import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import DatePicker from "react-native-modern-datepicker";
import EventCard from "../components/EventCard";
// Redux
import { useState } from "react";
import { useSelector } from "react-redux";

export default function SearchScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);

  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [result, setResult] = useState([]);

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  const handleSubmit = () => {
    // fetch backend pour récupérer tous les events
    fetch(`${BACKEND_URL}/events/all/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          const searchEvents = [];

          // Filtrer avec les critères de recherche
          for (let event of data.events) {
            if (event.city.toLowerCase() === city.toLowerCase()) {
              if (event.category.name === category) {
                if (event.date.slice(0, 10) === formatedDate) {
                  searchEvents.push(event);
                }
              }
            }
          }

          if (searchEvents.length) {
            setResult(searchEvents);
          } else {
            setResult([]);
            alert("aucune sortie n'est trouvée");
          }
        } else {
          alert("aucune sortie n'est trouvée");
        }
      });
  };

  let eventsCard = [];

  if (result.length) {
    eventsCard = result.map((event, i) => {
      return (
        <EventCard
          key={i}
          navigation={navigation}
          id={event._id}
          title={event.title}
          city={event.city}
          seats={event.seats}
          participants={event.participants}
          date={event.date}
        />
      );
    });
  }

  const categoryList = [
    { label: "Bar", value: "Bar" },
    { label: "Restaurant", value: "Restaurant" },
    { label: "Cinéma", value: "Cinéma" },
    { label: "Théâtre", value: "Théâtre" },
    { label: "Sport", value: "Sport" },
    { label: "Voyage", value: "Voyage" },
    { label: "Tricot", value: "Tricot" },
    { label: "Pêche à la mouche", value: "Pêche à la mouche" },
  ];

  const formatedDate =
    selectedDate.slice(0, 4) +
    "-" +
    selectedDate.slice(5, 7) +
    "-" +
    selectedDate.slice(8, 10);

  // Pour le datepicker
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
      <Text style={styles.title}>Rechercher une sortie</Text>
      <ScrollView>
        <View style={styles.inputList}>
          <View style={styles.inputContainer}>
            <Text style={styles.text}>Ville :</Text>
            <TextInput
              placeholder="Ville"
              onChangeText={(value) => setCity(value)}
              value={city}
              style={styles.input}
              maxLength={30}
              selectionColor="#6C5CE7"
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

          <DatePicker
            style={styles.datepicker}
            options={{
              mainColor: "#6C5CE7",
              borderColor: "#6C5CE7",
              selectedTextColor: "#fff",
            }}
            minimumDate={minimumDate}
            mode="calendar"
            onSelectedChange={(date) => setSelectedDate(date)}
          />

          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Rechercher</Text>
          </TouchableOpacity>

          {eventsCard}
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
    marginTop: 50,
    fontSize: 34,
    fontWeight: "500",
    color: "#263238",
    marginLeft: 20,
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
    backgroundColor: "#6C5CE7",
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
