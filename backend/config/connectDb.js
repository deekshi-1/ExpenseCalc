const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.udec97z.mongodb.net/?appName=Cluster0`;

console.log(url); 

const connect = async () => {
  try {
    const connection = await mongoose.connect(url);
    console.log(`MongoDB connected :${connection.connection.host}-${connection.connection.port}`);
  } catch (error) {
    console.error(`Error : ${error}`);
    process.exit(1);
  }
};

module.exports = connect;
  