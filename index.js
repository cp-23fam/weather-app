require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require('path')

const Location = require("./schemas/location");
const User = require("./schemas/user");
const auth = require("./middlewares/auth");

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.get("/", auth.auth, (req, res, next) => res.sendFile(path.join(__dirname, '/views/index.html')));

app.post("/", auth.auth, async (req, res) => {
  await Location.insertOne({
    title: req.body.location,
    temperature: req.body.temp,
    description: req.body.desc,
    timestamp: Date.now(),
    userId: req.user._id,
  });

  res.sendStatus(201);
});

app.get("/:location", auth.auth, async (req, res) => {
  const location = req.params.location;

  const locations = await Location.find({
    title: location,
    userId: req.user._id,
  })
    .sort({ timestamp: -1 })
    .limit(10);

  res.status(200).json(locations);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.redirect(401, "/user/login.html");
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (err) {
      console.log(err);
      return res.redirect(500, "/user/login.html");
    }

    if (result) {
      const token = jwt.sign(
        {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          _id: user._id,
        },
        process.env["JWT_PRIVATE_KEY"],
        {
          expiresIn: "10min",
        },
      );

      res.set("Authorization", `Bearer ${token}`);
      return res.json({token: token});
    } else {
      return res.redirect(403, "/user/login.html");
    }
  });
});

app.post("/signup", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await User.insertOne({
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: hashed,
  });

  return res.redirect("/user/login.html");
});

mongoose
  .connect(process.env["CONNECTION_STRING"])
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    }),
  )
  .catch((err) => console.log(err));
