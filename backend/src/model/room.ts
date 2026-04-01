import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomId: String,
    language: String,
  },
  { timestamps: true }
);

const Room = mongoose.model("room", roomSchema);

export default Room;