const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./routes/main.route");
const db = require("./config/connectDb");
const cookieParser = require("cookie-parser");
const errHandler = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();
app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://expensecalc-8kro.onrender.com"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
db();

app.use("/", router);

app.use(errHandler);


const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
