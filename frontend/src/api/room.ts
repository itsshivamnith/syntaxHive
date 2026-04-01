/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface CreateRoomData {
    language: string
    roomId :string,
}

interface joinRoomData {
    roomId :string,
}

const createRoomData = async ({language, roomId}: CreateRoomData) => {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/room/createroom`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({language, roomId})
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create room");
  }
  return data;
};

export const createRoom = () => {
    return useMutation({
        mutationFn: (props: CreateRoomData) => createRoomData(props),
        onSuccess: () => {
            toast.success("Code room created succesfully");
        },
        onError:(err)=>{
            toast.error(err.message || "Failed to join Code room");
        }
    })
}

const joinRoomData = async ({roomId}: joinRoomData) => {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/room/joinroom`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomId })
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to join room");
  }
  return data;
};

export const joinRoom = () => {
    return useMutation({
        mutationFn: (props: joinRoomData) => joinRoomData(props),
        onSuccess: () => {
            toast.success("Join code room successfully");
        },
        onError:()=>{
            toast.error("Failed to join code room");
        }
    })
}