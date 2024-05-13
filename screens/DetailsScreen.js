import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useEffect, useState } from "react";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { removeEvent } from "../reducers/events";
import { addEventRegister, removeEventCreated, removeEventRegister } from "../reducers/user";

export default function DetailsScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [event, setEvent] = useState(null);

  const { itemId } = route.params;

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetch(BACKEND_URL + "/events/details/" + user.token + "/" + itemId)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setEvent(data.event);
        }
      });
  }, []);

  // Inscription
  const handleRegisterToAnEvent = () => {
    fetch(BACKEND_URL + "/events/register/" + user.token + "/" + itemId, {
      method: "PUT",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(addEventRegister(event));
          navigation.navigate("TabNavigator", { screen: "MyEvents" });
        }
      });
  };

  // Désinscription
  const handleUnregisterToAnEvent = () => {
    fetch(BACKEND_URL + "/events/unregister/" + user.token + "/" + itemId, {
      method: "PUT",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(removeEventRegister(event._id));
          navigation.navigate("TabNavigator", { screen: "MyEvents" });
        }
      });
  };

  // Supprimer si createur
  const handleDeleteEvent = () => {
    fetch(BACKEND_URL + "/events/" + user.token + "/" + itemId, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(removeEventCreated(event._id)); // supprimé de ma liste d'events créer
          dispatch(removeEvent(event._id)); // supprimé de la liste générale
          navigation.navigate("TabNavigator", { screen: "MyEvents" });
        }
      });
  };

  let userIsCreator = false;
  if (event) {
    if (event.creator?._id === user.id) {
      userIsCreator = true;
    }
  }

  let userIsParticipant = false;
  if (event) {
    userIsParticipant = event.participants.includes(user.id);
  }

  // Formatage de la date et de l'heure
  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleDateString("fr-FR", options);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} activeOpacity={0.8} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={20} color="#263238" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Détails de la sortie</Text>
        <View  style={styles.event}>
          <View style={styles.eventHeader}>
            <FontAwesome style={styles.eventIcon} name="university" size={28} color="#FFF" />
            <Text style={styles.headerText}>{event?.title}</Text>
          </View>

          <View style={styles.eventInfo}>
            <View style={styles.iconContainer}>
              <FontAwesome name="map-marker" size={24} color="#263238" />
            </View>
            <Text style={styles.text}>{event?.city}</Text>
          </View>

          <View style={styles.eventInfo}>
            <View style={styles.iconContainer}>
              <FontAwesome name="calendar" size={24} color={"#263238"} />
            </View>
            <Text style={styles.text}>{formatDateTime(event?.date)}</Text>
          </View>

          <View style={styles.eventInfo}>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" size={24} color="#263238" />
            </View>
            <Text style={styles.text}>Nombre de participant : {event?.participants.length}</Text> 
          </View>

          <View style={styles.eventInfo}>
            <Text style={styles.description}> Description : {event?.description}</Text>
          </View>

        </View>
      </View>

      {userIsCreator && (
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => handleDeleteEvent()}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Supprimer</Text>
          </View>
        </TouchableOpacity>
      )}

      {!userIsCreator && !userIsParticipant && (
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => handleRegisterToAnEvent()}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>M'inscrire</Text>
          </View>
        </TouchableOpacity>
      )}

      {userIsParticipant && (
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => handleUnregisterToAnEvent()}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Me désinscrire</Text>
          </View>
        </TouchableOpacity>
      )}
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
    marginLeft: 10,
    width: 80,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E1E3E6",
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: "500",
    marginTop: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077B6',
    borderRadius: 10,
    width: 300,
    height: 75,
    color: '#FFFFFF',
  },
  headerText: {
    color: '#FFF',
    fontSize: 20,
  },
  eventIcon: {
    marginLeft: 24,
    marginRight: 10,
  },
  eventInfo: {
    flexDirection: 'row',
    marginTop: 20,
  },
  text: {
    fontSize: 20,
    marginLeft: 10
  },
  iconContainer: {
    width: 30,
    alignItems: 'center'
  },
  description: {
    fontSize: 20,
  },
  button: {
    backgroundColor: "#0077B6",
    borderRadius: 8,
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: 'center',
    marginTop: 50,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
  },
});
