import { useState } from "react";
import api from "../services/api";
import "./Auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            setMessage(response.data?.message || "Login successful");
            setEmail("");
            setPassword("");
        } catch (error) {
            const errMessage = error.response?.data || "Login failed";
            setMessage(typeof errMessage === "string" ? errMessage : "Login failed");
            console.error("Login error:", error);
        }
    };

    return (
        <main className="auth-page">

            <div className="auth-card">

                <h1>Login</h1>

                <p className="auth-subtitle">
                    Welcome back! Please login to your account.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Login
                    </button>

                    {message && <p className="auth-message">{message}</p>}

                </form>

            </div>

        </main>
    );
}

export default Login;