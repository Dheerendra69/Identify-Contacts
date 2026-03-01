require("dotenv").config();
const express = require("express");
const identifyRoute = require("./routes/identify");

const app = express();
app.use(express.json());

app.use("/", identifyRoute);
app.listen(3000, () => console.log("Server running"));
