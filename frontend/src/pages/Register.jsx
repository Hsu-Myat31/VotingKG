import { useState } from "react";
import "./Auth.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log("Register data:", {
            name,
            email,
            password,
        });
    };

    return (
        <main className="auth-page">

            <div className="auth-card">

                <h1>Create Account</h1>

                <p className="auth-subtitle">
                    Create your new account.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="name">
                            Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Enter your name"
                            required
                        />
                    </div>

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
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Register
                    </button>

                </form>

            </div>

        </main>
    );
}

export default Register;