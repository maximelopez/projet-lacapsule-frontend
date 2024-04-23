import { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import EventCard from "../components/EventCard";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { loadEvents } from "../reducers/events";

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
          const eventsOfTheDay = [];
          for (let event of data.events) {
            if (event.date.slice(0, 10) === localDateFormated) {
              eventsOfTheDay.push(event);
            }
          }
          dispatch(loadEvents(eventsOfTheDay));
        }
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sorties du jour</Text>
      <View style={styles.events}>
        <FlatList
          data={events}
          renderItem={({ item }) => (
            <EventCard
              navigation={navigation}
              id={item._id}
              title={item.title}
              address={item.address}
              seats={item.seats}
              participants={item.participants}
              date={item.date}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 34, //as per figma//
    fontWeight: "500", //as per figma//
    marginTop: 50, //espacement pour decaler titre//
    alignSelf: "center",
  },
  events: {
    flex: 1,
  },
});
