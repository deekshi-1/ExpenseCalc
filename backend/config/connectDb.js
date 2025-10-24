const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/Expense";

const connect = async () => {
  try {
    const connection = await mongoose.connect(url);
    console.log(`MongoDB connected :${connection.connection.host}-${connection.connection.port}`);
  } catch (error) {
    console.error(`Error : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connect;
