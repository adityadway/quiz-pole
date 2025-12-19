let poll = null;
let pollHistory = [];
let chatMessages = [];
let participants = {}; // socketId -> { name, role, socketId }

function createPoll(question, options, duration = 60) {
    poll = {
        id: Date.now(),
        question,
        options,
        duration,
        startTime: Date.now(),
        answers: {},    // socketId -> optionIndex
        students: {},   // socketId -> studentName
        status: "ACTIVE"
    };
    return poll;
}

function submitAnswer(socketId, optionIndex) {
    if (!poll) return false;
    if (poll.status !== "ACTIVE") return false;
    if (poll.answers[socketId] !== undefined) return false;

    poll.answers[socketId] = optionIndex;
    return true;
}

function endPoll() {
    if (!poll) return;
    poll.status = "ENDED";
    poll.endTime = Date.now();

    // Calculate results
    const results = calculateResults(poll);
    poll.results = results;

    // Save to history
    pollHistory.push({ ...poll });
}

function calculateResults(pollData) {
    const counts = new Array(pollData.options.length).fill(0);
    const totalVotes = Object.keys(pollData.answers).length;

    Object.values(pollData.answers).forEach(optionIndex => {
        counts[optionIndex]++;
    });

    return pollData.options.map((option, index) => ({
        option,
        count: counts[index],
        percentage: totalVotes > 0 ? ((counts[index] / totalVotes) * 100).toFixed(1) : 0
    }));
}

function canCreateNewPoll() {
    if (!poll) return true;
    return poll.status === "ENDED";
}

function getPoll() {
    return poll;
}

function getPollHistory() {
    return pollHistory;
}

// Participant management
function addParticipant(socketId, name, role) {
    participants[socketId] = { socketId, name, role };
    return participants[socketId];
}

function removeParticipant(socketId) {
    delete participants[socketId];
}

function getParticipants() {
    return Object.values(participants);
}

function getParticipant(socketId) {
    return participants[socketId];
}

// Chat management
function addChatMessage(socketId, message) {
    const participant = participants[socketId];
    if (!participant) return null;

    const chatMessage = {
        id: Date.now(),
        socketId,
        name: participant.name,
        role: participant.role,
        message,
        timestamp: Date.now()
    };

    chatMessages.push(chatMessage);
    return chatMessage;
}

function getChatMessages() {
    return chatMessages;
}

module.exports = {
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
};
