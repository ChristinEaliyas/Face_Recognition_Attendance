import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "../styles/AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(username, password);
    try {
      const response = await axios.post("http://127.0.0.1:7000/admin/login", {
        username: username,
        password: password,
      });

      console.log(response.data);
      if (response.status === 200) {
        navigate("/admin/student/registration");
      }
    } catch (error) {
      // Handle errors (e.g., show an error message)
      console.error("Login failed", error);
    }
  };
  return (
    <div className="login">
      <div className="container">
        <div className="title">Login</div>
        <div className="content">
          <form onSubmit={handleLogin}>
            <div className="user-details">
              <div className="input-box">
                <p>
                  <span className="details">Full Name</span>
                </p>
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-box">
                <p>
                  <span className="details">Password</span>
                </p>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="button login">
              <input type="submit" value="Register" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
