var ids = {
  google: {
    cliendId: process.env["GOOGLE_CLIENTID"],
    clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
    callbackUrl: "http://localhost:3000/auth/google/callback",
  },
};

module.exports = ids;
