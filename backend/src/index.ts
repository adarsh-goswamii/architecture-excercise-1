
import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const redisHost = "127:0:0:1"; // localhost
const redisPort = 6379; // default port
const client = createClient({
  url: `redis://${redisHost}:${redisPort}`
});
client.on('error', (err) => console.log("Redis client error", err));

app.post("/submit-code", async(req, res) => {
  const { code, problem_id, user_id, language } = req.body;

  try {
    await client.lPush("submissions", JSON.stringify({ code, problem_id, user_id, language }));

    res.status(200).send("Submission recieved");
  } catch (error) {
    console.error("redis error", error);
    res.status(500).send("Failed to store submission");
  }
});

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to redis");

    app.listen(3000, () => {
      console.log("Server is up and running");
    });
  } catch (error) {
    console.log("Failed to start server", error);
  }
};

startServer();