import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    id: null,
    firstname: null,
    email: null,
    eventsLiked: [],
    eventsRegister: [],
    eventsCreated: [],
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Connexion
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.id = action.payload.id;
      state.value.firstname = action.payload.firstname;
      state.value.email = action.payload.email;
    },
    // Désinscription
    logout: (state) => {
      state.value.token = null;
      state.value.id = null;
      state.value.firstname = null;
      state.value.email = null;
    },
    // Liker un event
    likeEvent: (state, action) =>{
      if (state.value.eventsLiked.includes(action.payload)) { // .id ?
        state.value.eventsLiked = state.value.eventsLiked.filter(
          (event) => event !== action.payload // .id ?
        );
      } else {
        state.value.eventsLiked.push(action.payload);
      }
    },
    // Charger la liste des events likés
    loadEventsLiked: (state, action) => {
      state.value.eventsLiked = action.payload;
    },
    // Charger la liste des propositions
    loadEventsCreated: (state, action) => {
      state.value.eventsCreated = action.payload;
    },
    // Ajouter un event à la liste des propositions
    addEventCreated: (state, action) => {
      state.value.eventsCreated.push(action.payload);
    },
    // Supprimer un event de la liste des propositions
    removeEventCreated: (state, action) => {
      state.value.eventsCreated = state.value.eventsCreated.filter(
        (event) => event._id !== action.payload
      );
    },
    // Charger la liste des inscriptions
    loadEventsRegister: (state, action) => {
      state.value.eventsRegister = action.payload;
    },
    // Ajouter un event à la liste des inscriptions
    addEventRegister: (state, action) => {
      state.value.eventsRegister.push(action.payload);
    },
    // Supprimer un event de la liste des inscriptions
    removeEventRegister: (state, action) => {
      state.value.eventsRegister = state.value.eventsRegister.filter(
        (event) => event._id !== action.payload
      );
    },
  },
});

export const {
  login,
  logout,
  likeEvent,
  loadEventsLiked,
  loadEventsRegister,
  loadEventsCreated,
  addEventRegister,
  addEventCreated,
  removeEventRegister,
  removeEventCreated,
} = userSlice.actions;
export default userSlice.reducer;
