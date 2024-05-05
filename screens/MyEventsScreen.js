import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import EventCard from "../components/EventCard";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { loadEventsCreated, loadEventsRegister } from "../reducers/user";

export default function MyEventsScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  useEffect(() => {
    // Inscriptions
    fetch(BACKEND_URL + "/events/register/" + user.token)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(loadEventsRegister(data.events));
        }
      });

    // Propositions
    fetch(BACKEND_URL + "/events/created/" + user.token)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(loadEventsCreated(data.events));
        }
      });
  }, []);

  // inscriptions
  const registerList = user.eventsRegister.map((event, i) => {
    return (
      <EventCard key={i} id={event._id} navigation={navigation} />
    );
  });

  // Propositions
  const createdList = user.eventsCreated.map((event, i) => {
    return (
      <EventCard key={i} id={event._id} navigation={navigation} />
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes sorties</Text>

      <ScrollView style={styles.events}>
        <View style={styles.propositions}>
          <Text style={styles.subTitle}>Mes propositions :</Text>
          {createdList}
        </View>
        <View style={styles.inscriptions}>
          <Text style={styles.subTitle}>Mes inscriptions :</Text>
          {registerList}
        </View>
      </ScrollView>
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
    fontSize: 34,
    fontWeight: "500",
    marginTop: 50,
    alignSelf: "center",
  },
  subTitle: {
    fontSize: 20,
    color: "#263238",
    marginLeft: 20,
    marginTop: 25,
  },
  events: {
    flex: 1,
  },
  propositions: {
    marginBottom: 20,
  },
});
