import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    loadEvents: (state, action) => {
      state.value = action.payload;
    },
    addEvent: (state, action) => {
      state.value.push(action.payload);
    },
    removeEvent: (state, action) => {
      state.value = state.value.filter((event) => event._id !== action.payload);
    },
  },
});

export const { loadEvents, addEvent, removeEvent, updateEvent } =
  eventsSlice.actions;
export default eventsSlice.reducer;
