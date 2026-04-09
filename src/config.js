require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  mongoUri: process.env.MONGODB_URI,
  fortniteApiKey: process.env.FORTNITE_API_KEY,
};
