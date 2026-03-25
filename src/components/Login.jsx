import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Backend ko request bhejein
            const res = await axios.post('https://spendwise-backend-u4nz.onrender.com/api/auth/login', formData);
            
            // 2. Agar status 200 hai (Success)
            if (res.status === 200) {
                localStorage.setItem('userName', res.data.user.name);
                localStorage.setItem('token', res.data.token);
                alert("Login Successful! 🎉");
                onLoginSuccess(); // Dashboard dikhane ke liye
            }
        } catch (err) {
            // 3. Agar koi error aaya (400, 404, 500 etc.)
            console.error("Login Error:", err);
            alert(err.response?.data?.message || "Login Failed ❌");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login to SpendWise</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    required 
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;