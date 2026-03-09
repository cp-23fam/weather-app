require("dotenv").config({ quiet: true });

const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");

const indexRouter = require("./routes");
const authRouter = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(
  session({
    secret: process.env["SESSION_SECRET"],
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + "/public"));

const PORT = process.env.PORT || 3000;

app.use("/", indexRouter);
app.use("/auth", authRouter);

mongoose
  .connect(process.env["CONNECTION_STRING"])
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    }),
  )
  .catch((err) => console.log(err));
