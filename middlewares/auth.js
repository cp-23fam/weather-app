const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const authorization = req.cookies["Authorization"];

  if (!authorization) {
    return res.redirect("/user/login.html");
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    if (req.path == "/") {
      return res.redirect("/user/login.html");
    }

    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, process.env["JWT_PRIVATE_KEY"], (err, decoded) => {
    if (err) {
      if (req.path == "/") {
        return res.redirect("/user/login.html");
      }

      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = decoded;
  });
  next();
};
