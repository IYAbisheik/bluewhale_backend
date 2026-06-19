export const registerRoomEvents = (
    io,
    socket
) => {

    socket.on(
        "create-room",
        (roomCode) => {

            socket.join(roomCode);

            console.log(
                `${socket.user.id} created room ${roomCode}`
            );

        }
    );

    socket.on(
        "join-room",
        (roomCode) => {

            socket.join(roomCode);

            console.log(
                `${socket.user.id} joined room ${roomCode}`
            );

        }
    );

};