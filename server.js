import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/modules/Users/routes/user.routes.js";
import platformRoutes from "./src/modules/platform/routes/platform.routes.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Node.js backend is running!");
});

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from Node.js backend" });
});

// Auth routes
app.use("/api/users", authRoutes);
app.use("/api/platform", platformRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});