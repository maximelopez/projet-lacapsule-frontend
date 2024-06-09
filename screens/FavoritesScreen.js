import { StyleSheet, Text, View, ScrollView } from "react-native";
import EventCard from "../components/EventCard";
import { useSelector } from "react-redux";

export default function FavoritesScreen({ navigation }) {
    const user = useSelector((state) => state.user.value);

    const likeList = user.eventsLiked.map((event, i) => {
        return (
            <EventCard key={i} id={event} navigation={navigation} />
        )
    })

    return (
        <View style={styles.container}>
            <Text style={styles.title }>Mes favoris</Text>
            <ScrollView>
                {likeList}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",

      alignItems: 'center'
    },
    title: {
        fontSize: 34,
        fontWeight: "500",
        marginTop: 50,
        alignSelf: "center",
      },
  });
  