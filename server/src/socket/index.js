const socketSetup = (io) => {
    // Track rooms and their users
    const rooms = new Map();

    // Add detailed logging to your Socket.io server
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Check room capacity before joining
        socket.on("check-room", (roomId, callback) => {
            const room = io.sockets.adapter.rooms.get(roomId);
            const userCount = room ? room.size : 0;

            console.log(`Room ${roomId} capacity check: ${userCount} user(s)`);

            callback({
                userCount,
                isFull: userCount >= 2,
            });
        });

        // When a user joins a room
        socket.on("join-room", (roomId, userId) => {
            // Check if room is already full
            const room = io.sockets.adapter.rooms.get(roomId);
            const numClients = room ? room.size : 0;

            if (numClients >= 2) {
                console.log(`Room ${roomId} is full, rejecting user ${userId}`);
                // Emit room-full event to the client trying to join
                socket.emit("room-full");
                return;
            }

            console.log(`User ${userId} (${socket.id}) joined room ${roomId}`);
            socket.join(roomId);

            // Track room users
            if (!rooms.has(roomId)) {
                rooms.set(roomId, new Set());
            }
            rooms.get(roomId).add(userId);

            // Log room participants
            const updatedRoom = io.sockets.adapter.rooms.get(roomId);
            const updatedNumClients = updatedRoom ? updatedRoom.size : 0;
            console.log(
                `Room ${roomId} now has ${updatedNumClients} client(s)`
            );

            // Notify other users in the room
            socket.to(roomId).emit("user-connected", userId);

            // Handle disconnect
            socket.on("disconnect", () => {
                console.log(
                    `User ${userId} (${socket.id}) disconnected from room ${roomId}`
                );

                // Remove user from our tracking
                if (rooms.has(roomId)) {
                    rooms.get(roomId).delete(userId);

                    // Clean up empty rooms
                    if (rooms.get(roomId).size === 0) {
                        rooms.delete(roomId);
                        console.log(
                            `Room ${roomId} is now empty and has been removed`
                        );
                    }
                }

                socket.to(roomId).emit("user-disconnected", userId);
            });
        });

        // For signaling - passing WebRTC offers, answers, and ICE candidates
        socket.on("signal", ({ userId, roomId, signal }) => {
            console.log(
                `Signal from ${userId} in room ${roomId} - signal type: ${
                    signal.type || "unknown"
                }`
            );

            // Check if the room exists
            const room = io.sockets.adapter.rooms.get(roomId);
            if (!room) {
                console.error(
                    `Room ${roomId} does not exist, cannot forward signal`
                );
                return;
            }

            // Forward signal to others in room
            socket.to(roomId).emit("signal", { userId, signal });
            console.log(`Signal forwarded to others in room ${roomId}`);
        });

        // Clean up on general disconnect
        socket.on("disconnect", () => {
            console.log(`Socket ${socket.id} disconnected`);

            // If tracking is needed outside of specific room handlers,
            // additional cleanup could be done here
        });
    });
};

module.exports = socketSetup;
