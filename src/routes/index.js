const { Router } = require("express");
const auth = require("../middlewares/auth");
const path = require("path");
const Location = require("../models/location");

const indexRouter = Router();

indexRouter.get("/", auth.isAuth, (req, res, next) =>
  res.sendFile(path.join(__dirname, "../views/index.html")),
);

indexRouter.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "../views/login.html")),
);

// indexRouter.get("/signup", (req, res) =>
//   res.sendFile(path.join(__dirname, "../views/signup.html")),
// );

indexRouter.post("/", auth.isAuth, async (req, res) => {
  await Location.insertOne({
    title: req.body.location,
    temperature: req.body.temp,
    description: req.body.desc,
    timestamp: Date.now(),
    userId: req.user._id,
  });

  res.sendStatus(201);
});

indexRouter.get("/location/:location", auth.isAuth, async (req, res) => {
  const location = req.params.location;

  const locations = await Location.find({
    title: location,
    userId: req.user._id,
  })
    .sort({ timestamp: -1 })
    .limit(10);

  res.status(200).json(locations);
});

// indexRouter.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email: email });

//   if (!user) {
//     return res.redirect(401, "/login");
//   }

//   bcrypt.compare(password, user.password, function (err, result) {
//     if (err) {
//       console.log(err);
//       return res.redirect(500, "/login");
//     }

//     if (result) {
//       const token = jwt.sign(
//         {
//           firstname: user.firstname,
//           lastname: user.lastname,
//           email: user.email,
//           _id: user._id,
//         },
//         process.env["JWT_PRIVATE_KEY"],
//         {
//           expiresIn: "10min",
//         },
//       );

//       res.set("Authorization", `Bearer ${token}`);
//       return res.json({ token: token });
//     } else {
//       return res.redirect(403, "/login");
//     }
//   });
// });

// indexRouter.post("/signup", async (req, res) => {
//   const { firstname, lastname, email, password } = req.body;

//   const hashed = await bcrypt.hash(password, 10);

//   await User.insertOne({
//     firstname: firstname,
//     lastname: lastname,
//     email: email,
//     password: hashed,
//   });

//   return res.redirect("/login");
// });

module.exports = indexRouter;
