import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Login = ({ setUser }) => {
    const navigate = useNavigate(); // <--- hook to navigate
    const [data, setData] = useState({ email: "", password: "" });

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    // Login.jsx
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:1000/api/v1/signin", data);
            const userData = response.data.others;


            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));


            // Navigate to Dashboard page with a success message in state
            navigate("/dashboard", { state: { message: `Welcome, ${userData.username}! Login Successful.` } });

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Login Failed.");
        }
    };


    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={submitHandler}>
                <h2>Login</h2>
                <div className="input-group">
                    <label>Email</label>
                    <input type="email" name="email" value={data.email} onChange={changeHandler} required />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input type="password" name="password" value={data.password} onChange={changeHandler} required />
                </div>
                <button type="submit" className="auth-btn">Sign In</button>
                <p>Don't have an account? <Link to="/register">Sign Up here</Link></p>
            </form>
        </div>
    );
};

export default Login;
