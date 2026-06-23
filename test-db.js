import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DIRECT_URL,
});

try {
  await client.connect();
  console.log("✅ Connected successfully");
  await client.end();
} catch (error) {
  console.error(error);
}