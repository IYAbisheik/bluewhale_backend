import jwt from "jsonwebtoken";

export const socketAuth = (
    socket,
    next
) => {

    try {

        const token =
            socket.handshake.auth.token;

        if (!token) {
            return next(
                new Error("No token provided")
            );
        }

        const user = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        socket.user = user;

        next();

    } catch (error) {

        console.error(
            "Socket Auth Error:",
            error.message
        );

        next(
            new Error("Unauthorized")
        );

    }

};