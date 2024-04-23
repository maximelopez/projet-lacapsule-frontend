import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function EventCard({ navigation, id, title, address, date, participants, seats }) {

    const eventDate = date.slice(8, 10) + '/' + date.slice(5, 7) + '/' + date.slice(0, 4);
    const eventHour = date.slice(11, 13) + 'h' + date.slice(14, 16);

    return(
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <FontAwesome name='university' size={20} color='#263238' />
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <FontAwesome name='heart' size={20} color='#263238' />
                    </View>
                </View>
                <View style={styles.location}>
                    <FontAwesome name='map-marker' size={20} color='#263238' />
                    <Text style={styles.locationText}>{address} le {eventDate} à {eventHour}</Text>
                </View>
                <View style={styles.participants}>
                    <FontAwesome name='user' size={20} color='#263238' />
                    <Text style={styles.participantsText}>{participants.length} participants sur {seats}</Text>
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