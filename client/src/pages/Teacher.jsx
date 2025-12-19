import { useState, useEffect } from "react";
import { socket } from "../socket";
import "./Teacher.css";
import logo from "../assets/Frame 427319795.png";
import historyIcon from "../assets/Group 289666.png";
import ChatParticipantsPanel from "../components/ChatParticipantsPanel";

export default function Teacher() {
    const [poll, setPoll] = useState(null);
    const [pollHistory, setPollHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(true);
    const [showPanel, setShowPanel] = useState(false);
    const [participants, setParticipants] = useState([]);

    // Form state
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([
        { text: "", isCorrect: true },
        { text: "", isCorrect: false }
    ]);
    const [duration, setDuration] = useState(60);

    useEffect(() => {
        // Set role
        socket.emit("user:set_role", { name: "Teacher", role: "teacher" });

        // Listen for initial state
        socket.on("state:initial", (state) => {
            // Setting up initial data when teacher joins the session
            if (state.poll) {
                setPoll(state.poll);
                setShowCreateForm(false);
            }
            if (state.pollHistory) {
                setPollHistory(state.pollHistory);
            }
            // Load existing participants if any students are already connected
            if (state.participants) {
                setParticipants(state.participants);
            }
        });

        // Listen for poll started
        socket.on("poll:started", (newPoll) => {
            setPoll(newPoll);
            setShowCreateForm(false);
        });

        // Listen for poll updates
        socket.on("poll:update", (updatedPoll) => {
            setPoll(updatedPoll);
        });

        // Listen for poll ended
        socket.on("poll:ended", (endedPoll) => {
            setPoll(endedPoll);
        });

        // Listen for poll history
        socket.on("poll:history", (history) => {
            setPollHistory(history);
        });

        // Listen for participants updates
        // This will update the list whenever a student joins or leaves
        socket.on("participants:update", (updatedParticipants) => {
            setParticipants(updatedParticipants);
        });

        return () => {
            socket.off("state:initial");
            socket.off("poll:started");
            socket.off("poll:update");
            socket.off("poll:ended");
            socket.off("poll:history");
            socket.off("participants:update");
        };
    }, []);

    const handleAddOption = () => {
        setOptions([...options, { text: "", isCorrect: false }]);
    };

    const handleOptionChange = (index, text) => {
        const newOptions = [...options];
        newOptions[index].text = text;
        setOptions(newOptions);
    };

    // const validatePollForm = () => {
    //     return question.trim() && options.filter(o => o.text.trim()).length >= 2;
    // };

    const handleCorrectChange = (index, isCorrect) => {
        const newOptions = [...options];
        newOptions[index].isCorrect = isCorrect;
        setOptions(newOptions);
    };

    const handleCreatePoll = () => {
        const validOptions = options.filter(opt => opt.text.trim());
        if (!question.trim() || validOptions.length < 2) return;

        socket.emit("teacher:create_poll", {
            question: question.trim(),
            options: validOptions.map(opt => opt.text.trim()),
            duration
        });

        // Reset form
        setQuestion("");
        setOptions([
            { text: "", isCorrect: true },
            { text: "", isCorrect: false }
        ]);
    };

    const handleAskNewQuestion = () => {
        setShowCreateForm(true);
        setPoll(null);
    };

    const handleViewHistory = () => {
        socket.emit("poll:get_history");
        setShowHistory(true);
    };

    const handleKickStudent = (studentId) => {
        socket.emit("teacher:kick_student", studentId);
    };

    // const handleExportResults = () => {
    //     const csvData = results.map(r => `${r.option},${r.percentage}%`).join('\n');
    //     console.log('Export results:', csvData);
    // };

    // const handleResetPoll = () => {
    //     setPoll(null);
    //     setShowCreateForm(true);
    // };

    if (showHistory) {
        return <PollHistory history={pollHistory} onClose={() => setShowHistory(false)} />;
    }

    if (showCreateForm || !poll) {
        return (
            <div className="teacher-container">
                <div className="teacher-content fade-in">
                    <img src={logo} alt="Intervue Poll" width="120" />

                    <h1>Let's Get Started</h1>
                    <p className="subtitle">
                        you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
                    </p>

                    <div className="create-poll-form">
                        <div className="form-header">
                            <label>Enter your question</label>
                            <div className="select-wrapper">
                                <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                                    <option value={30}>30 seconds</option>
                                    <option value={60}>60 seconds</option>
                                    <option value={90}>90 seconds</option>
                                    <option value={120}>120 seconds</option>
                                </select>
                                <svg className="select-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
                                    <path d="M1 1L6 6L11 1" stroke="#4F0DCE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                        <textarea
                            placeholder="Enter Your question here"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            rows={3}
                        />
                        <div className="char-count">{question.length}/100</div>

                        <div className="options-section">
                            <h3>Edit Options</h3>
                            <div className="correct-label">Is it Correct?</div>
                        </div>

                        {options.map((option, index) => (
                            <div key={index} className="option-row">
                                <div className="option-input-wrapper">
                                    <div className="option-number">{index + 1}</div>
                                    <input
                                        type="text"
                                        placeholder="Enter option here"
                                        value={option.text}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                    />
                                </div>
                                <div className="radio-group">
                                    <label>
                                        <input
                                            type="radio"
                                            name={`correct-${index}`}
                                            checked={option.isCorrect}
                                            onChange={() => handleCorrectChange(index, true)}
                                        />
                                        <span>Yes</span>
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`correct-${index}`}
                                            checked={!option.isCorrect}
                                            onChange={() => handleCorrectChange(index, false)}
                                        />
                                        <span>No</span>
                                    </label>
                                </div>
                            </div>
                        ))}

                        <button className="btn-secondary add-option-btn" onClick={handleAddOption}>
                            + Add More option
                        </button>
                    </div>

                    <button
                        className="btn-primary ask-question-btn"
                        onClick={handleCreatePoll}
                        disabled={!question.trim() || options.filter(o => o.text.trim()).length < 2}
                    >
                        Ask Question
                    </button>
                </div>
            </div>
        );
    }

    // Show results
    const results = poll.liveResults || poll.results || [];
    const isEnded = poll.status === "ENDED";

    return (
        <div className="teacher-container">
            <div className="teacher-results fade-in">
                {isEnded && (
                    <img src={historyIcon} alt="History" className="view-history-btn" onClick={handleViewHistory} width="160" height="40" />
                )}

                <h2>Question</h2>

                <div className="question-results-card">
                    <div className="question-box">
                        <p>{poll.question}</p>
                    </div>

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
                </div>

                {isEnded && (
                    <button className="btn-primary new-question-btn" onClick={handleAskNewQuestion}>
                        + Ask a new question
                    </button>
                )}
            </div>

            <button className="chat-button" onClick={() => setShowPanel(!showPanel)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor" />
                </svg>
            </button>

            {showPanel && (
                <ChatParticipantsPanel
                    participants={participants}
                    onKickStudent={handleKickStudent}
                    onClose={() => setShowPanel(false)}
                />
            )}
        </div >
    );
}

function PollHistory({ history, onClose }) {
    return (
        <div className="poll-history-modal fade-in">
            <div className="modal-content slide-in">
                <div className="modal-header">
                    <h2>View Poll History</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="history-list">
                    {history.map((poll, pollIndex) => (
                        <div key={poll.id} className="history-item">
                            <h3>Question {pollIndex + 1}</h3>
                            <div className="question-box">
                                <p>{poll.question}</p>
                            </div>
                            <div className="results-list">
                                {poll.results && poll.results.map((result, index) => (
                                    <div key={index} className="result-item">
                                        <div className="result-header">
                                            <div className="result-label">
                                                <div className="option-number">{index + 1}</div>
                                                <span>{result.option}</span>
                                            </div>
                                            <span className="percentage">{result.percentage}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${result.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
