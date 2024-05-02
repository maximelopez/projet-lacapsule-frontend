import EventCard from "../components/EventCard";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useEffect } from "react";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { loadEvents } from "../reducers/events";
import { loadEventsLiked } from "../reducers/user";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);
  const events = useSelector((state) => state.events.value);

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

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

  const localDate = formatDateTime(new Date());
  const localDateFormated =
    localDate.slice(6, 10) +
    "-" +
    localDate.slice(3, 5) +
    "-" +
    localDate.slice(0, 2);

  useEffect(() => {
    fetch(BACKEND_URL + "/events/all/" + user.token)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(loadEvents(data.events));
          // Récupérer les likes de l'utilisateur
          fetch(BACKEND_URL + "/users/like/" + user.token)
          .then(response => response.json())
          .then(data => {
            dispatch(loadEventsLiked(data.eventsLiked));
          })
        }
      });
  }, []);

  const eventsOfTheDay = events.map((event, i) => {
    if (event.date.slice(0, 10) === localDateFormated) {
      return <EventCard key={i} id={event._id} navigation={navigation} />
    }
  });

  console.log(eventsOfTheDay)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sorties du jour</Text>
      <ScrollView>
        <View style={styles.events}>{eventsOfTheDay}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "500",
    marginTop: 50,
    alignSelf: "center",
  },
  events: {
    flex: 1,
  },
});
