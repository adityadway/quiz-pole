import { useState } from "react";
import "./RoleSelection.css";
import logo from "../assets/Frame 427319795.png";

export default function RoleSelection({ onRoleSelect }) {
    const [selectedRole, setSelectedRole] = useState(null);
    const [studentName, setStudentName] = useState("");
    const [showNameInput, setShowNameInput] = useState(false);

    const handleRoleClick = (role) => {
        setSelectedRole(role);
        if (role === "teacher") {
            // Teachers go directly without name input
            onRoleSelect(role, "Teacher");
        } else {
            // Students need to enter name
            setShowNameInput(true);
        }
    };

    const handleContinue = () => {
        if (selectedRole === "student" && studentName.trim()) {
            onRoleSelect("student", studentName.trim());
        }
    };

    // const validateName = (name) => {
    //     return name.trim().length >= 2 && name.trim().length <= 30;
    // };

    // const handleKeyPress = (e) => {
    //     if (e.key === 'Enter' && studentName.trim()) {
    //         handleContinue();
    //     }
    // };

    if (showNameInput && selectedRole === "student") {
        return (
            <div className="role-selection-container fade-in">
                <div className="role-selection-content">
                    {/* <div className="badge"> */}
                    <img src={logo} alt="Intervue Poll" width="120" />
                    {/*
                    </div> */}

                    <h1 className="main-title">Let's <strong>Get Started</strong></h1>
                    <p className="subtitle">
                        If you're a student, you'll be able to <strong>submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates
                    </p>

                    <div className="name-input-section">
                        <label htmlFor="studentName">Enter your Name</label>
                        <input
                            id="studentName"
                            type="text"
                            placeholder="Aditya Dave"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleContinue()}
                            autoFocus
                        />
                    </div>

                    <button
                        className="btn-primary"
                        onClick={handleContinue}
                        disabled={!studentName.trim()}
                    >
                        Continue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="role-selection-container fade-in">
            <div className="role-selection-content">
                {/* <div className="badge"> */}
                <img src={logo} alt="Intervue Poll" width="120" />
                {/* </div> */}

                <h1 className="main-title">
                    Welcome to the <span className="highlight">Live Polling System</span>
                </h1>
                <p className="subtitle">
                    Please select the role that best describes you to begin using the live polling system
                </p>

                <div className="role-cards">
                    <div
                        className={`role-card ${selectedRole === "student" ? "selected" : ""}`}
                        onClick={() => handleRoleClick("student")}
                    >
                        <h3>I'm a Student</h3>
                        <p>Choose the answer you think is correct.
                            Tap on one option to submit your response.</p>
                    </div>

                    <div
                        className={`role-card ${selectedRole === "teacher" ? "selected" : ""}`}
                        onClick={() => handleRoleClick("teacher")}
                    >
                        <h3>I'm a Teacher</h3>
                        <p>Submit answers and view live poll results in real-time.</p>
                    </div>
                </div>

                <button
                    className="btn-primary"
                    onClick={() => selectedRole && handleRoleClick(selectedRole)}
                    disabled={!selectedRole}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
