import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { getDistance } from "geolib";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Dropdown } from "react-native-element-dropdown";

import { useSelector } from "react-redux";

export default function MyEventsVersionMapScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  // token de l'utilisateur
  const token = user?.token; // "?" est très important sinon il n'est pas pris en compte dans le fetch
  const [currentPosition, setCurrentPosition] = useState(null);
  const [newPlace, setNewPlace] = useState("");

  //Switch//
  // const [isEnabled, setIsEnabled] = useState(false);
  // const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
  const [showmarkers, setShowmarkers] = useState(false);
  const [eventmarker, setEventmarker] = useState(null);
  const [distance, setDistance] = useState(null);
  let markers = null;
  //Géolocalisation//
  // on accède aux coordonées GPS de la personne possédant le smartphone
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setCurrentPosition(location.coords);
        });
      }
    })();
  }, []);

  //Carte initiale//
  const INITIAL_REGION = {
    latitude: 45.166672,
    longitude: 5.71667,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };
  const distanceList = [
    { label: "1km", value: 1000 },
    { label: "2km", value: 2000 },
    { label: "5km", value: 5000 },
    { label: "10km", value: 10000 },
    { label: "200km", value: 200000 },
  ];
  //
  // appui sur le bouton "voir les sorties" :
  //
  const handlePress = () => {
    //Récupération de la liste de tous les événements//
    //
    fetch(`${BACKEND_URL}/events/all/${token}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          let events = data.events;
          let villes = [];
          let coordvilly = [];
          let nearEvents = [];
          for (let i = 0; i < events.length; i++) {
            // on reporte toutes les villes trouvées dans un tableau:
            villes[i] = events[i].address;
            // console.log(villes, "villes"); // affichage OK
            // à chaque itération, on prend 1 élément du tableau différent => ses coordonnées GPS dans le fetch suivant :
            let villy = villes[i].toLowerCase();
            fetch(`https://api-adresse.data.gouv.fr/search/?q=${villy}`)
              .then((response) => response.json())
              .then((data) => {
                const firstVille = data.features[0];
                // console.log(currentPosition, "currentPosition");
                // {"accuracy": 61.63399887084961, "altitude": 279.6000061035156, "altitudeAccuracy": 13.854545593261719, "heading": 0, "latitude": 45.1650864, "longitude": 5.7221884, "speed": 0}
                if (data.features[0]) {
                  // si adresse mal définie on n'aura pas de résultat mais on veut que ça fonctione qd même
                  // on doit mettre une cdt ici d'où le "if"
                  let coordinates = {
                    latitude: firstVille.geometry.coordinates[1],
                    longitude: firstVille.geometry.coordinates[0],
                  };
                  // calcul de la distance entre ma position et celle des différentes sorties proposées
                  let distanceToEvent = getDistance(
                    {
                      latitude: coordinates.latitude,
                      longitude: coordinates.longitude,
                    },
                    {
                      latitude: currentPosition.latitude,
                      longitude: currentPosition.longitude,
                    }
                  );
                  //
                  // tableau contenant toutes les coordonnées des villes trouvées à chaque itération
                  coordvilly[i] = coordinates;
                  //console.log(coordvilly); ici OK donc on doit mettre l'ajout des marqueurs dans la boucle / fetch /if
                  // on parcourt le tableau coordvilly pour prendre les coordonnées des villes
                  // tableau des villes proches = nearEvents
                  // distance = la distance max choisie pour les sorties proposées dans le Dropdown
                  if (distanceToEvent < distance) {
                    nearEvents.push(coordvilly[i]);
                  }
                  setEventmarker(
                    nearEvents.map((data, i) => {
                      return (
                        <Marker
                          key={i}
                          coordinate={{
                            latitude: data.latitude,
                            longitude: data.longitude,
                          }}
                          title={events[i].name}
                        />
                      );
                    })
                  );
                  // version non triée par distance:
                  // setEventmarker(
                  //   coordvilly.map((data, i) => {
                  //     return (
                  //       <Marker
                  //         key={i}
                  //         coordinate={{
                  //           latitude: data.latitude,
                  //           longitude: data.longitude,
                  //         }}
                  //         title={events[i].name}
                  //       />
                  //     );
                  //   })
                  // );
                }
              })
              .catch((error) => {
                console.error("Error fetching coordinates:", error);
              });
          }
        } else {
          alert("pas d'événement trouvé");
        }
      });

    // essai intial sur une ville "en dur": marqueur correspondant = "marker"
    const city = "Lille";
    fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}`)
      .then((response) => response.json())
      .then((data) => {
        const firstCity = data?.features[0];
        let coordinates = {
          latitude: firstCity.geometry.coordinates[1],
          longitude: firstCity.geometry.coordinates[0],
        };
        setNewPlace(coordinates);
      })
      .catch((error) => {
        console.error("Error fetching coordinates:", error);
      });
    setShowmarkers(true);
  };

  if (showmarkers) {
    // console.log(newPlace);
    markers = (
      <Marker
        coordinate={{
          latitude: newPlace.latitude ? newPlace.latitude : 0,
          longitude: newPlace.longitude ? newPlace.longitude : 0,
        }}
        title="Lille"
        pinColor="#fecb2d"
      />
    );
  }
  // retour au profil si appui sur le bouton
  const handleBack = () => {
    navigation.navigate("TabNavigator", { screen: "Profile" });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>
        <Text style={styles.titleLine}>Sorties version carte</Text>
      </Text>
      <View style={styles.boxes}>
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText} onPress={() => handlePress()}>
            Sorties sur la carte
          </Text>
        </TouchableOpacity>
        <Dropdown
          style={styles.dropdown}
          placeholder="Sélectionner"
          data={distanceList}
          maxHeight={300}
          labelField="label"
          valueField="value"
          onChange={(item) => setDistance(item.value)}
          value={distance}
        />

        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText} onPress={() => handleBack()}>
            Retour au profil
          </Text>
        </TouchableOpacity>
      </View>
      {/* <Switch
        style={styles.switch}
        trackColor={{ false: "#767577", true: "#6C5CE7" }}
        thumbColor={isEnabled ? "#6C5CE7" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      /> */}
      <View style={styles.mapContainer}>
        <MapView
          initialRegion={INITIAL_REGION} //modifiable//
          style={styles.map}
          zoomControlEnabled={true}
          mapType="hybrid" //modifiable - hybrid/terrain/satellite//
        >
          {/* Affichage du marqueur pour Lille, en jaune: */}
          {markers}
          {/* Affichage du marqueur pour tous les événements: */}
          {eventmarker}
          {/*  ma position en jaune */}
          {currentPosition && (
            <Marker
              coordinate={currentPosition}
              title="My position"
              pinColor="#fecb2d"
            />
          )}
        </MapView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 50, //décale composant vers bas//
    textAlign: "center",
    color: "purple",
  },
  titleLine: {
    fontSize: 34, //as per figma//
    fontWeight: "500", //as per figma//
    textAlign: "center", //centre au milieu//
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6C5CE7",
    borderRadius: 8,
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 150,
    marginTop: 35,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
  },
  // switch: {
  //   marginLeft: 100,
  //   marginTop: -50,
  // },
  mapContainer: {
    flex: 1,
    width: "90%",
    marginTop: 20, //espacement
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    marginBottom: 20,
    flex: 1,
  },
  boxes: {
    // à changer si l'on veut changer la postion des boutons mais pas urgent
    flexDirection: "column",
    alignItems: "center",
  },
  dropdown: {
    width: 200,
    margin: 8,
    height: 30,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    fontSize: 18,
    alignSelf: "left",
  },
});
