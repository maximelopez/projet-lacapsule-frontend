import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { removeEvent } from "../reducers/events";
import {
  addEventRegister,
  removeEventCreated,
  removeEventRegister,
} from "../reducers/user";

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

  
  //Modifier si créateur
  const handleUpdateEvent = () => {
    navigation.navigate("EditEventPosted", { itemId: itemId }); // ligne modifiée
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
      <TouchableOpacity
        style={styles.back}
        activeOpacity={0.8}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome name="arrow-left" size={20} color="#263238" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.details}>Détails de la sortie</Text>
        <View style={styles.category}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome name="university" size={30} color="#263238" />
            <Text style={styles.title}>
              {"  "}
              {event?.title}
            </Text>
          </View>
        </View>
        <View style={styles.address}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome name="map-marker" size={20} color="#263238" />
            <Text style={styles.nameaddress}>
              {"    "}
              {event?.address}
            </Text>
          </View>
        </View>
        <View style={styles.datehour}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome
              style={styles.calendar}
              name="calendar"
              size={25}
              color={"#263238"}
            />
            <Text style={styles.hourtxt}>
              {" "}
              {"  "}
              {formatDateTime(event?.date)}
            </Text>
          </View>
        </View>
        <View style={styles.nbseats}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome name="user" size={20} color="#263238" />

            <Text style={styles.seatstxt}>
              {" "}
              {"   "}
              {event?.participants.length} personnes inscrites
            </Text>
          </View>
        </View>
        <View style={styles.descriptioncontent}>
          <Text style={styles.desc}>{event?.description}</Text>
        </View>
      </View>
      {/* //Le user est organisateur */}
      {userIsCreator && (
        <>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => handleDeleteEvent()}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Supprimer</Text>
              <FontAwesome style={styles.arrow} name="arrow-right" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => handleUpdateEvent()}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Modifier</Text>
              <FontAwesome style={styles.arrow} name="arrow-right" />
            </View>
          </TouchableOpacity>
        </>
      )}
      {/* Le user n'est ni participant ni organisateur */}
      {!userIsCreator && !userIsParticipant && (
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => handleRegisterToAnEvent()}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>M'inscrire</Text>
            <FontAwesome style={styles.arrow} name="arrow-right" />
          </View>
        </TouchableOpacity>
      )}
      {/* Le user est participant */}
      {userIsParticipant && (
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => handleUnregisterToAnEvent()}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Me désinscrire</Text>
            <FontAwesome style={styles.arrow} name="arrow-right" />
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
    alignItems: "flex-start",
    marginTop: 25, //espacement//
    marginLeft: 10, //espacement//
    backgroundColor: "#D2B8F2",
    borderRadius: 10, //as per figma
    width: "95%", //as per figma
    height: "65%",
  },
  details: {
    fontSize: 34, //as per figma//
    fontWeight: "500", //as per figma//
    letterSpacing: -1,
    paddingLeft: 25, //espacement
    paddingTop: 15, //espacement
  },
  title: {
    fontSize: 28,
  },
  category: {
    paddingTop: 25,
    paddingLeft: 15,
  },
  address: {
    marginTop: 35,
    paddingLeft: 25,
  },
  nameaddress: {
    fontSize: 22, //as per figma
  },
  datehour: {
    marginTop: 15,
    paddingLeft: 20,
  },
  hourtxt: {
    fontSize: 22, //as per figma
  },
  nbseats: {
    marginTop: 15,
    paddingLeft: 25,
  },
  seatstxt: {
    fontSize: 22, //as per figma
  },

  descriptioncontent: {
    paddingTop: 150, //espacement
    paddingLeft: 100, //espacement
  },
  desc: {
    fontSize: 22,
  },
  button: {
    backgroundColor: "#6C5CE7",
    borderRadius: 8,
    width: 300,
    height: 50,
    alignItems: "center", //centre texte//
    justifyContent: "center", //centre texte//
    marginTop: 10, //espacement
    marginLeft: 50, //espacement
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
  },
  buttonContent: {
    flexDirection: "row", //dans le but espacer txt et fleche//
    alignItems: "center", //centre fleche//
  },
  arrow: {
    marginLeft: 30, // as per figma//
    color: "white", //as per figma//
  },
});
