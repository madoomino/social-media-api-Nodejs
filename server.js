const app = require("./app");

// Dealing with env file
require("dotenv").config({ path: "./config/.env" });

const PORT = process.env.PORT || 3005;
const DB_URI = process.env.DB_URI;

// DB CONNECTION
const connectDB = require("./config/database").connectDb;

// RUNNING THE SERVER
async function run(uri) {
  connectDB(uri).then(() =>
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
  );
}

run(DB_URI);
