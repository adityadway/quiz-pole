import { useState, useEffect } from "react";
import { socket } from "../socket";
import "./Student.css";
import logo from "../assets/Frame 427319795.png";
import ChatParticipantsPanel from "../components/ChatParticipantsPanel";

export default function Student({ userName }) {
    const [poll, setPoll] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [kicked, setKicked] = useState(false);

    useEffect(() => {
        // Set role and join
        socket.emit("user:set_role", { name: userName, role: "student" });

        // Listen for initial state
        socket.on("state:initial", (state) => {
            if (state.poll && state.poll.status === "ACTIVE") {
                setPoll(state.poll);
                calculateTimeRemaining(state.poll);
            }
        });

        // Listen for new polls
        socket.on("poll:started", (newPoll) => {
            setPoll(newPoll);
            setSelectedAnswer(null);
            setHasAnswered(false);
            calculateTimeRemaining(newPoll);
        });

        // Listen for poll updates
        socket.on("poll:update", (updatedPoll) => {
            setPoll(updatedPoll);
        });

        // Listen for poll end
        socket.on("poll:ended", (endedPoll) => {
            setPoll(endedPoll);
        });

        // Listen for kick
        socket.on("student:kicked", () => {
            setKicked(true);
        });

        return () => {
            socket.off("state:initial");
            socket.off("poll:started");
            socket.off("poll:update");
            socket.off("poll:ended");
            socket.off("student:kicked");
        };
    }, [userName]);

    useEffect(() => {
        if (!poll || poll.status !== "ACTIVE") return;

        const interval = setInterval(() => {
            calculateTimeRemaining(poll);
        }, 1000);

        return () => clearInterval(interval);
    }, [poll]);

    const calculateTimeRemaining = (pollData) => {
        const elapsed = Date.now() - pollData.startTime;
        const remaining = Math.max(0, pollData.duration * 1000 - elapsed);
        setTimeRemaining(Math.ceil(remaining / 1000));
    };

    const handleAnswerSelect = (index) => {
        if (hasAnswered || poll.status !== "ACTIVE") return;
        setSelectedAnswer(index);
    };

    const handleSubmit = () => {
        if (selectedAnswer === null || hasAnswered) return;
        socket.emit("student:submit_answer", selectedAnswer);
        setHasAnswered(true);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // const calculateProgress = () => {
    //     if (!poll || !timeRemaining) return 0;
    //     return ((poll.duration - timeRemaining) / poll.duration) * 100;
    // };

    if (kicked) {
        return (
            <div className="student-container">
                <div className="kicked-message fade-in">
                    <h2>You've been kicked out!</h2>
                    <p>The teacher has removed you from this session.</p>
                </div>
            </div>
        );
    }

    if (!poll) {
        return (
            <div className="student-container">
                <div className="waiting-screen fade-in">
                    <img src={logo} alt="Intervue Poll" width="120" />
                    <div className="spinner"></div>
                    <h2>Wait for the teacher to ask questions..</h2>
                </div>
                <ChatButton onClick={() => setShowChat(!showChat)} />
            </div>
        );
    }

    const showResults = hasAnswered || poll.status === "ENDED";
    const results = poll.liveResults || poll.results || [];

    return (
        <div className="student-container">
            <div className="poll-content fade-in">
                <div className="poll-header">
                    <h3>Question 1</h3>
                    {poll.status === "ACTIVE" && timeRemaining !== null && (
                        <div className="timer">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                                <path d="M8 4V8L11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span className={timeRemaining <= 10 ? "timer-warning" : ""}>
                                {formatTime(timeRemaining)}
                            </span>
                        </div>
                    )}
                </div>

                <div className="question-results-card">
                    <div className="question-box">
                        <p>{poll.question}</p>
                    </div>

                    {!showResults ? (
                        <div className="options-list">
                            {poll.options.map((option, index) => (
                                <div
                                    key={index}
                                    className={`option-item ${selectedAnswer === index ? "selected" : ""}`}
                                    onClick={() => handleAnswerSelect(index)}
                                >
                                    <div className="option-number">{index + 1}</div>
                                    <span>{option}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="results-list">
                            {results.map((result, index) => (
                                <div key={index} className="result-item">
                                    <div className="result-content">
                                        <div className="option-badge">{index + 1}</div>
                                        <span className="option-text">{result.option}</span>
                                        <span className="percentage">{result.percentage}%</span>
                                    </div>
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${result.percentage}%` }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {!showResults && (
                    <button
                        className="btn-primary submit-btn"
                        onClick={handleSubmit}
                        disabled={selectedAnswer === null}
                    >
                        Submit
                    </button>
                )}

                {poll.status === "ENDED" && (
                    <p className="wait-message">Wait for the teacher to ask a new question.</p>
                )}
            </div>

            <ChatButton onClick={() => setShowChat(!showChat)} />

            {showChat && (
                <ChatParticipantsPanel
                    participants={[]}
                    onKickStudent={() => { }}
                    onClose={() => setShowChat(false)}
                    isStudent={true}
                />
            )}
        </div>
    );
}

function ChatButton({ onClick }) {
    return (
        <button className="chat-button" onClick={onClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    );
}
