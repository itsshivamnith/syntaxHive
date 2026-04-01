import { Request, Response } from "express";
import Room from "../model/room.js";

export const handleCreateRoom = async (req: Request, res: Response) => {
  try {
    const { language, roomId } = req.body;
    const result = await Room.create({
      language,
      roomId,
    });
    res.status(201).json({ msg: "Room Created Sucessfully", result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to Created Room" });
  }
};

export const handleJoinRoom = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.body;
    const result = await Room.findOne({ roomId });
    if (!result) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.status(201).json({ msg: "Room Fetch Sucessfully", result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to Fetch Room" });
  }
};
