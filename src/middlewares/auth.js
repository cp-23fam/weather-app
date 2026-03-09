const jwt = require("jsonwebtoken");

exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
  // res.status(401).json({
  //   message: "Access denied. Please log in.",
  // });
};
