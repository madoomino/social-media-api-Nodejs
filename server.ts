import app from "./app";
import { config } from "dotenv";

// Dealing with env file
config({ path: "./src/config/.env" });

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

// DB CONNECTION
import { connectDB } from "./src/config/database";

// RUNNING THE SERVER
async function run(uri: string | undefined) {
  connectDB(uri).then(() =>
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
  );
}

// STARTING SERVER
run(DB_URI);
