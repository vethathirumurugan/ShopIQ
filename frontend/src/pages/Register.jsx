import React, { useState } from 'react';
import axios from 'axios';
import "./Register.css";
const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', formData);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="firstName" type="text" placeholder="First Name" required onChange={handleChange} /><br />
        <input name="lastName" type="text" placeholder="Last Name" required onChange={handleChange} /><br />
        <input name="email" type="email" placeholder="Email" required onChange={handleChange} /><br />
        <input name="phone" type="text" placeholder="Phone Number" required onChange={handleChange} /><br />
        <select name="gender" required onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select><br />
        <input name="password" type="password" placeholder="Password" required onChange={handleChange} /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
