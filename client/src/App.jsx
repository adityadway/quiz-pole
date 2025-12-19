import { useState } from "react";
import RoleSelection from "./pages/RoleSelection";
import Student from "./pages/Student";
import Teacher from "./pages/Teacher";

function App() {
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState("");

  const handleRoleSelect = (selectedRole, name) => {
    setRole(selectedRole);
    setUserName(name);
  };

  if (!role) {
    return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

  if (role === "student") {
    return <Student userName={userName} />;
  }

  return <Teacher />;
}

export default App;
