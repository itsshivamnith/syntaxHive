import express from "express";
import {
  getCurrentUser,
  handleSignIn,
  handleSignOut,
  handleSignUp,
} from "../controller/user.js";

const userRoute = express.Router();

userRoute.post("/signup", handleSignUp);
userRoute.post("/signin", handleSignIn);
userRoute.post("/signout", handleSignOut);
userRoute.get("/user", getCurrentUser);

export default userRoute;
