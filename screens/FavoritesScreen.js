import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import EventCard from "../components/EventCard";
import { useSelector } from "react-redux";

export default function FavoritesScreen({ navigation }) {
    const user = useSelector((state) => state.user.value);

    // A tester
    const likeList = user.eventsLiked.map((event, i) => {
        return (
            <EventCard key={i} id={event} navigation={navigation} />
        )
    })

    return (
        <View style={styles.container}>
            <Text>Favorites</Text>
            {likeList}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: 'center',
      alignItems: 'center'
    },
  });
  