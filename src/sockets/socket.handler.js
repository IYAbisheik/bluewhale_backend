import { registerRoomEvents }
    from "./room.socket.js";

import { registerMessageEvents }
    from "./message.socket.js";

export const initializeSocket = (
    io
) => {

    io.on(
        "connection",
        (socket) => {

            console.log(
                `User ${socket.user.id} connected`
            );

            registerRoomEvents(
                io,
                socket
            );

            registerMessageEvents(
                io,
                socket
            );

            socket.on("disconnect", () => {

                console.log(
                    `User ${socket.user.id} disconnected`
                );

            });

        }
    );

};