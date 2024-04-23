// Composants
import DetailsScreen from "./screens/DetailsScreen";
//import EditEventPostedScreen from "./screens/EditEventPostedScreen";
import HomeScreen from "./screens/HomeScreen";
import MyEventsScreen from "./screens/MyEventsScreen";
//import MyEventsVersionMapScreen from "./screens/MyEventsVersionMapScreen";
import PostScreen from "./screens/PostScreen";
//import ProfileCreationScreen from "./screens/ProfileCreationScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchScreen from "./screens/SearchScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
// import EditEventPosted from "./screens/EditEventPosted";
import WelcomeScreen from "./screens/WelcomeScreen";

// Icons
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Navigation
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Redux
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import events from "./reducers/events";
import user from "./reducers/user";

const store = configureStore({
  reducer: { user, events },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Home") {
            iconName = "home";
          }
          if (route.name === "Post") {
            iconName = "plus-circle";
          }
          if (route.name === "Search") {
            iconName = "search";
          }
          if (route.name === "MyEvents") {
            iconName = "calendar";
          }
          if (route.name === "Profile") {
            iconName = "user-circle";
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6C5CE7",
        tabBarInactiveTintColor: "rgba(38, 50, 56, 0.5)",
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Accueil" }}
      />
      <Tab.Screen
        name="Post"
        component={PostScreen}
        options={{ tabBarLabel: "Créer" }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarLabel: "Rechercher" }}
      />
      <Tab.Screen
        name="MyEvents"
        component={MyEventsScreen}
        options={{ tabBarLabel: "Mes sorties" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Mon profil" }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          {/* <Stack.Screen name="EditEventPosted" component={EditEventPostedScreen} /> */}
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          {/* <Stack.Screen name="ProfileCreation" component={ProfileCreationScreen} /> */}
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
