export const registerMessageEvents = (
    io,
    socket
) => {

    socket.on(
        "send-room-message",
        (data) => {

            io.to(data.roomCode)
                .emit(
                    "receive-room-message",
                    {
                        roomCode: data.roomCode,
                        senderId: socket.user.id,
                        message: data.message,
                    }
                );

        }
    );

};