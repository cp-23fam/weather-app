require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");

const Location = require("./schemas/location");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.post("/", async (req, res) => {
  console.log(req.body);

  await Location.insertOne({
    title: req.body.location,
    temperature: req.body.temp,
    description: req.body.desc,
    timestamp: Date.now(),
  });

  res.sendStatus(201);
});

app.get("/:location", async (req, res) => {
  const location = req.params.location;

  const locations = await Location.find({ title: location }).sort({ timestamp: -1 }).limit(10);

  res.status(200).json(locations);
});

mongoose
  .connect(process.env['CONNECTION_STRING'])
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    }),
  )
  .catch((err) => console.log(err));
