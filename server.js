import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/modules/Users/routes/user.routes.js";
import platformRoutes from "./src/modules/platform/routes/platform.routes.js"
import v1Router from "./src/modules/V1Router.js"
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { requestLogger } from "./src/modules/utils/generateToken.js";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { initializeSocket } from "./src/sockets/socket.handler.js";
import { socketAuth } from "./src/middlewares/socketAuth.middleware.js";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServer } from "@apollo/server";
import { resolvers } from "./src/graphql/resolvers.js"
import { typeDefs } from "./src/graphql/typeDefs.js"

dotenv.config();

const app = express();

const logDir = path.join(process.cwd(), "logs");

const server = http.createServer(app);

const serverForGraphQl = new ApolloServer({
    typeDefs,
    resolvers,
});

export const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
    },
});

io.use(socketAuth);

initializeSocket(io)

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const accessLogStream = fs.createWriteStream(
  path.join(logDir, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", {
  stream: accessLogStream,
}));

app.use(morgan("dev"));

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(express.json());

app.use(requestLogger);
app.use(cookieParser());

app.use("/api/v1", v1Router);

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

async function startServer() {
    // Start Apollo Server
    await serverForGraphQl.start();

    // Register GraphQL middleware
    app.use(
        "/graphql",
        express.json(),
        expressMiddleware(serverForGraphQl)
    );

    // Start HTTP server
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
}

startServer().catch((err) => {
    console.error("Failed to start server:", err);
});