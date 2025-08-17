import express from "express";
import { getChat } from "../controller/chat.controller";

const router = express.Router();
const apiString = "/api";

router.post(`${apiString}/chats`, getChat);

export default router;
