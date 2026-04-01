import mongoose from "mongoose";

const dbConnection = (url: string) => {
  return mongoose.connect(url);
};

export default dbConnection;
