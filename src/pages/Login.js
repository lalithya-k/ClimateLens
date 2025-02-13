import React, { useState } from "react";
import GoogleLoginButton from "../components/GoogleLoginButton";
import "../styles/main.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(null);

    // Handle Registration
    const handleRegister = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data.success) {
                alert("Registration successful! You can now log in.");
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Error registering user");
            console.error(error);
        }
    };

    // Handle Login with Email & Password
    const handleLogin = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data.success) {
                alert("Login Successful!");
                setToken(data.access_token);  // ✅ Store JWT Token
                localStorage.setItem("token", data.access_token);  // ✅ Save Token Locally
            } else {
                alert("Invalid credentials");
            }
        } catch (error) {
            alert("Error logging in");
            console.error(error);
        }
    };

    // Handle Logout
    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem("token");  // ✅ Remove Token
        alert("Logged out successfully!");
    };

    return (
        <div className="login-container">
            <h2>Login to ClimateLens</h2>

            {/* Email & Password Login */}
            {!token ? (
                <>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                    <button onClick={handleRegister}>Register</button>
                </>
            ) : (
                <button onClick={handleLogout}>Logout</button>
            )}

            <h3>Or Login with Google</h3>
            <GoogleLoginButton />
        </div>
    );
};

export default Login;
