const { Router } = require("express");
const passportGoogle = require("../auth/google");
const jwt = require("jsonwebtoken");

const authRouter = Router();

authRouter.get(
  "/google",
  passportGoogle.authenticate("google", {
    scope: ["email", "profile"],
  }),
);

authRouter.get(
  "/google/callback",
  passportGoogle.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/",
  }),
  // (req, res) => {
  //   const token = jwt.sign(
  //     {
  //       firstname: user.firstname,
  //       lastname: user.lastname,
  //       email: user.email,
  //       id: user.id,
  //     },
  //     process.env["JWT_PRIVATE_KEY"],
  //     {
  //       expiresIn: "10min",
  //     },
  //   );

  //   res.set("Authorization", `Bearer ${token}`);
  //   return res.status(200).json({ token: token });
  // },
);

module.exports = authRouter;
