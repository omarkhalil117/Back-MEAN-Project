require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log(err.message));

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("*", (req, res) => res.status(404).json({ message: "Not found" }));
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
