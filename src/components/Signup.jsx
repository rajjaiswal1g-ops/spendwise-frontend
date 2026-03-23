import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/signup', formData);
            alert("Signup Successful! 🎉 Ab aap Login kar sakte hain.");
        } catch (err) {
            alert(err.response?.data?.message || "Signup Failed ❌");
        }
    };

    return (
        <div className="auth-container" style={{ padding: '20px' }}>
            <h2>Create SpendWise Account</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required /><br/><br/>
                <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required /><br/><br/>
                <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required /><br/><br/>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;