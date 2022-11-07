require('dotenv').config()


const clientCredentials = {
    clientID: process.env.GN_ID,
    clientSecret: process.env.GN_SECRET
};


module.exports = { clientCredentials };