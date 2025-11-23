import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Register = ({ setUser }) => {
    const navigate = useNavigate();
    const [data, setData] = useState({ email: "", username: "", password: "" });

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:1000/api/v1/register", data);

            alert(response.data.message || "Registration Successful!");

            const userData = response.data.user || { email: data.email, username: data.username }; 
            setUser(userData);        // <-- update App.js state
            navigate("/kanban");      // <-- redirect to Kanban page

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Registration Failed.");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={submitHandler}>
                <h2>Sign Up</h2>
                <div className="input-group">
                    <label>Email</label>
                    <input type="email" name="email" value={data.email} onChange={changeHandler} required />
                </div>
                <div className="input-group">
                    <label>Username</label>
                    <input type="text" name="username" value={data.username} onChange={changeHandler} required />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input type="password" name="password" value={data.password} onChange={changeHandler} required />
                </div>
                <button type="submit" className="auth-btn">Register</button>
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </form>
        </div>
    );
};

export default Register;
