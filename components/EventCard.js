import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likeEvent } from "../reducers/user";

export default function EventCard({ navigation, id }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);

    const [event, setEvent] = useState(null);

    const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

    useEffect(() => {
        fetch(BACKEND_URL + "/events/details/" + user.token + "/" + id)
        .then((response) => response.json())
        .then((data) => {
            if (data.result) {
              setEvent(data.event);
            }
          });
    }, [user.eventsRegister]);

    const handleLike = () => {
        fetch(BACKEND_URL + "/users/like/" + user.token + "/" + id, {
            method: "PUT"
        })
            .then(response => response.json())
            .then(() => {
                dispatch(likeEvent(id));
            });
    };

    const eventDate = event?.date.slice(8, 10) + '/' + event?.date.slice(5, 7) + '/' + event?.date.slice(0, 4);
    const eventHour = event?.date.slice(11, 13) + 'h' + event?.date.slice(14, 16);

    // Icon like
    let heartStyle = "#263238";
    if (user.eventsLiked.includes(id)) {
        heartStyle = "#F43C3C";
    };

    // icons catégories
    let categoryIcon = '';

    if (event?.category.name === "Bar") {
        categoryIcon = "wine-glass"
    }
    if (event?.category.name === "Restaurant") {
        categoryIcon = "burger"
    }
    if (event?.category.name === "Sport") {
        categoryIcon = "table-tennis-paddle-ball";
    }
    if (event?.category.name === "Voyage") {
        categoryIcon = "suitcase-rolling";
    }
    if (event?.category.name === "Cinéma") {
        categoryIcon = "tv";
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <FontAwesome name={categoryIcon} size={24} color='#263238' />
                        <Text style={styles.title}>{event?.title}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        {
                            user.id === event?.creator._id || event?.participants.includes(user.id) ? null :
                            <TouchableOpacity onPress={() => handleLike()} activeOpacity={0.8}>
                                <FontAwesome name='heart' size={20} color={heartStyle} />
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                <View style={styles.location}>
                    <FontAwesome name='location-dot' size={20} color='#263238' />
                    <Text style={styles.locationText}>{event?.address} le {eventDate} à {eventHour}</Text>
                </View>
                <View style={styles.participants}>
                    <FontAwesome name='user-group' size={20} color='#263238' />
                    <Text style={styles.participantsText}>{event?.participants.length} participants sur {event?.seats}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} activeOpacity={0.5} onPress={() => navigation.navigate('Details', { itemId: id })}>
                        <Text style={styles.buttonText}>Détails</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
       
    )
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
    },
    content: {
        backgroundColor: "rgba(108, 92, 231, 0.1)",
        width: Dimensions.get('window').width * 0.9,
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerRight: {
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        marginLeft: 10,
    },
    location: {
        marginTop: 20,
        flexDirection: 'row'
    },
    locationText : {
        marginLeft: 10,
    },
    participants: {
        marginTop: 20,
        flexDirection: 'row',
    },
    participantsText: {
        marginLeft: 10,
    },
    buttonContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: 130,
        height: 40,
        borderWidth: 1,
        borderColor: '#263238'
    },
    buttonText: {
        color: '#263238',
        fontSize: 16,
    }
  });