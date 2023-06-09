import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  firstName: "",
  image: "",
  lastName: "",
  checker: "",
  _id: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRedux: (state, action) => {
      console.log(action.payload.data);
      //   state.user = action.payload.data;
      state._id = action.payload.data._id;
      state.firstName = action.payload.data.firstName;
      state.lastName = action.payload.data.lastName;
      state.email = action.payload.data.email;
      state.image = action.payload.data.image;
      state.checker = action.payload.data.checker;
    },
    signinRedux: (state, action) => {
      console.log(action.payload.data);
      //   state.user = action.payload.data;
      state.firstName = action.payload.data.firstName;
      state.lastName = action.payload.data.lastName;
      state.email = action.payload.data.email;
      state.image = action.payload.data.image;
      state.contact = action.payload.data.contact;
      state.checker = action.payload.data.checker;
    },
    logoutRedux: (state, action) => {
      console.log("logout");
      state._id = "";
      state.firstName = "";
      state.lastName = "";
      state.email = "";
      state.image = "";
      state.checker = "";
    },
  },
});

export const { loginRedux ,logoutRedux, signinRedux} = userSlice.actions;

export default userSlice.reducer;
