import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            // Adjust the URL to your backend API endpoint
            const response = await axios.post("http://localhost:1000/api/v1/signin", data);
            
            alert("Login Successful! Welcome, " + response.data.others.username);
            
            // In a real app, you would save the user data/token here
            // console.log(response.data.others); 

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Login Failed. Check email and password.");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={submitHandler}>
                <h2>Login</h2>
                
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={data.email} 
                        onChange={changeHandler} 
                        required 
                    />
                </div>
                
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={data.password} 
                        onChange={changeHandler} 
                        required 
                    />
                </div>
                
                <button type="submit" className="auth-btn">Sign In</button>
                
                <p>
                    Don't have an account? <Link to="/register">Sign Up here</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;