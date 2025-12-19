import { useState, useEffect } from "react";
import { socket } from "../socket";
import "./ChatParticipantsPanel.css";

export default function ChatParticipantsPanel({ participants, onKickStudent, onClose, isStudent = false }) {
    // Default to chat tab for students, participants tab for teachers
    const [activeTab, setActiveTab] = useState(isStudent ? "chat" : "participants");
    const [chatMessages, setChatMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");

    useEffect(() => {
        // Listen for incoming chat messages
        socket.on("chat:message", (message) => {
            setChatMessages(prev => [...prev, message]);
        });

        // Request initial chat history when component mounts
        socket.emit("chat:get_history");
        socket.on("chat:history", (history) => {
            setChatMessages(history);
        });

        return () => {
            socket.off("chat:message");
            socket.off("chat:history");
        };
    }, []);

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            // Send message to server
            socket.emit("chat:send", messageInput.trim());
            setMessageInput("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // const scrollToBottom = () => {
    //     const messagesDiv = document.querySelector('.chat-messages');
    //     if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;
    // };

    // const formatTimestamp = (date) => {
    //     return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    // };

    return (
        <>
            <div className="panel-overlay" onClick={onClose}></div>
            <div className="chat-participants-panel slide-in-right">
                <div className="panel-tabs">
                    <button
                        className={`tab-button ${activeTab === "chat" ? "active" : ""}`}
                        onClick={() => setActiveTab("chat")}
                    >
                        Chat
                    </button>
                    {!isStudent && (
                        <button
                            className={`tab-button ${activeTab === "participants" ? "active" : ""}`}
                            onClick={() => setActiveTab("participants")}
                        >
                            Participants
                        </button>
                    )}
                </div>

                {activeTab === "participants" ? (
                    <div className="participants-content">
                        <div className="participants-header">
                            <span className="header-label">Name</span>
                            <span className="header-label">Action</span>
                        </div>
                        <div className="participants-list">
                            {participants.filter(p => p.role === "student").length === 0 ? (
                                <p className="no-participants">No students connected</p>
                            ) : (
                                participants
                                    .filter(p => p.role === "student")
                                    .map((student) => (
                                        <div key={student.socketId} className="participant-item">
                                            <span className="participant-name">{student.name}</span>
                                            <button
                                                className="kick-button"
                                                onClick={() => onKickStudent(student.socketId)}
                                            >
                                                Kick out
                                            </button>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="chat-content">
                        <div className="chat-messages">
                            {chatMessages.length === 0 ? (
                                <p className="no-messages">No messages yet. Start the conversation!</p>
                            ) : (
                                chatMessages.map((msg, index) => (
                                    <div key={index} className={`chat-message ${msg.role === "teacher" ? "teacher-msg" : "student-msg"}`}>
                                        <span className="message-user">{msg.name}</span>
                                        <div className="message-bubble">{msg.message}</div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="chat-input-container">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="chat-input"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                className="send-button"
                                onClick={handleSendMessage}
                                disabled={!messageInput.trim()}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
