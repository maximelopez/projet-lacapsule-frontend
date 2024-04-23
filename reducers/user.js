import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    id: null,
    firstname: null,
    email: null,
    eventsRegister: [],
    eventsCreated: [],
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.id = action.payload.id;
      state.value.firstname = action.payload.firstname;
      state.value.email = action.payload.email;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.id = null;
      state.value.firstname = null;
      state.value.email = null;
    },
    loadEventsRegister: (state, action) => {
      state.value.eventsRegister = action.payload;
    },
    loadEventsCreated: (state, action) => {
      state.value.eventsCreated = action.payload;
    },
    addEventRegister: (state, action) => {
      state.value.eventsRegister.push(action.payload);
    },
    addEventCreated: (state, action) => {
      state.value.eventsCreated.push(action.payload);
    },
    removeEventRegister: (state, action) => {
      state.value.eventsRegister = state.value.eventsRegister.filter(
        (event) => event._id !== action.payload
      );
    },
    removeEventCreated: (state, action) => {
      state.value.eventsCreated = state.value.eventsCreated.filter(
        (event) => event._id !== action.payload
      );
    },
  },
});

export const {
  login,
  logout,
  loadEventsRegister,
  loadEventsCreated,
  addEventRegister,
  addEventCreated,
  removeEventRegister,
  removeEventCreated,
} = userSlice.actions;
export default userSlice.reducer;
