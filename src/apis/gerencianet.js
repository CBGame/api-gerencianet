const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");

const cert = fs.readFileSync(
  path.resolve(__dirname, `../../certs/${process.env.GN_CERT}`)
);

const agent = new https.Agent({
  pfx: cert,
  passphrase: "",
});

const authenticate = ({ clientID, clientSecret }) => {
  const credentials = Buffer.from(`${clientID}:${clientSecret}`).toString(
    "base64"
  );

  return axios({
    method: "POST",
    url: `${process.env.GN_ENDPOINT}/oauth/token`,
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    httpsAgent: agent,
    data: {
      grant_type: "client_credentials",
    },
  });
};

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const GNRequest = async (credentials) => {
  const authResponse = await authenticate(credentials);
  const accessToken = authResponse.data?.access_token;

  parseJwt(accessToken);

  return axios.create({
    baseURL: process.env.GN_ENDPOINT,
    httpsAgent: agent,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};

module.exports = GNRequest;
