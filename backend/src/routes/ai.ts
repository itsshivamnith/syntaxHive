import express from "express";
import { handleAiChat } from "../controller/ai.js";

const aiRoute = express.Router();

aiRoute.post('/', handleAiChat)

export default aiRoute;