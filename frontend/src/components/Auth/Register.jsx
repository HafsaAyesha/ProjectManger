import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Register = () => {
    const [data, setData] = useState({
        email: "",
        username: "",
        password: "",
    });

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            // Adjust the URL to your backend API endpoint
            const response = await axios.post("http://localhost:1000/api/v1/register", data);
            
            alert(response.data.message || "Registration Successful!");
            
            // Optionally redirect to login page
            // navigate('/login'); 

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Registration Failed. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={submitHandler}>
                <h2>Get Started (Sign Up)</h2>
                
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
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value={data.username} 
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
                
                <button type="submit" className="auth-btn">Register</button>
                
                <p>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;