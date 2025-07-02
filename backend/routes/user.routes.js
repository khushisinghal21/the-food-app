import express  from "express";

import {  LoginUser, RegisterUser } from "../controllers/user.controllers.js";

const userrouter = express.Router();
// User registration route
userrouter.post("/register", RegisterUser);

userrouter.post("/login", LoginUser);

export default userrouter;