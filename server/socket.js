const {
    createPoll,
    submitAnswer,
    endPoll,
    canCreateNewPoll,
    getPoll,
    getPollHistory,
    calculateResults,
    addParticipant,
    removeParticipant,
    getParticipants,
    getParticipant,
    addChatMessage,
    getChatMessages
} = require("./poll");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        // Role assignment
        socket.on("user:set_role", ({ name, role }) => {
            addParticipant(socket.id, name, role);
            console.log(`${role} joined: ${name} (${socket.id})`);

            // Send current state to new user
            const poll = getPoll();
            const participants = getParticipants();
            const chatMessages = getChatMessages();

            socket.emit("state:initial", {
                poll,
                participants,
                chatMessages,
                pollHistory: getPollHistory()
            });

            // Broadcast updated participants to everyone
            io.emit("participants:update", participants);
        });

        // Student joins (legacy support)
        socket.on("student:join", (name) => {
            const poll = getPoll();
            if (poll) {
                poll.students[socket.id] = name;
                addParticipant(socket.id, name, "student");
                io.emit("poll:update", poll);
                io.emit("participants:update", getParticipants());
            }
        });

        // Teacher creates poll
        socket.on("teacher:create_poll", ({ question, options, duration }) => {
            if (!canCreateNewPoll()) {
                socket.emit("error", { message: "A poll is already active" });
                return;
            }

            const poll = createPoll(question, options, duration);
            console.log("Poll created:", poll.id);

            // Broadcast to all users
            io.emit("poll:started", poll);

            // Auto-end poll after duration
            setTimeout(() => {
                endPoll();
                const endedPoll = getPoll();
                console.log("Poll ended:", endedPoll.id);
                io.emit("poll:ended", endedPoll);
            }, duration * 1000);
        });

        // Student submits answer
        socket.on("student:submit_answer", (optionIndex) => {
            const success = submitAnswer(socket.id, optionIndex);
            if (success) {
                const poll = getPoll();
                // Calculate live results
                const liveResults = calculateResults(poll);
                poll.liveResults = liveResults;

                console.log(`Answer submitted by ${socket.id}: option ${optionIndex}`);
                io.emit("poll:update", poll);
            } else {
                socket.emit("error", { message: "Could not submit answer" });
            }
        });

        // Chat message
        socket.on("chat:send", (message) => {
            const chatMessage = addChatMessage(socket.id, message);
            if (chatMessage) {
                console.log(`Chat from ${chatMessage.name}: ${message}`);
                io.emit("chat:message", chatMessage);
            }
        });

        // Teacher kicks student
        socket.on("teacher:kick_student", (targetSocketId) => {
            const participant = getParticipant(socket.id);

            // Verify requester is a teacher
            if (!participant || participant.role !== "teacher") {
                socket.emit("error", { message: "Unauthorized" });
                return;
            }

            const targetSocket = io.sockets.sockets.get(targetSocketId);
            if (targetSocket) {
                console.log(`Kicking student: ${targetSocketId}`);
                targetSocket.emit("student:kicked");
                targetSocket.disconnect(true);
            }
        });

        // Request poll history
        socket.on("poll:get_history", () => {
            socket.emit("poll:history", getPollHistory());
        });

        // Request chat history
        socket.on("chat:get_history", () => {
            socket.emit("chat:history", getChatMessages());
        });

        // Disconnect handling
        socket.on("disconnect", () => {
            const participant = getParticipant(socket.id);
            console.log("Socket disconnected:", socket.id, participant?.name);

            // Remove from poll if active
            const poll = getPoll();
            if (poll) {
                delete poll.students[socket.id];
                delete poll.answers[socket.id];
                io.emit("poll:update", poll);
            }

            // Remove from participants
            removeParticipant(socket.id);
            io.emit("participants:update", getParticipants());
        });
    });
};
