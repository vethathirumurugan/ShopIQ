import React, { useState } from 'react';
import axios from 'axios';
import "./Register.css";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};

    // ✅ Email validation
    if (!/^[\w.-]+@[a-zA-Z0-9.-]+\.(com|org)$/.test(formData.email)) {
      errs.email = "Invalid email (.com or .org only)";
    }

    // 🚫 Block .edu domain
    if (formData.email.endsWith(".edu")) {
      errs.email = "Invalid email (.edu not allowed)";
    }

    // ✅ Phone validation
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      errs.phone = "Invalid phone number";
    }

    // ✅ Password validation
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(formData.password)) {
      errs.password = "Password must be 8+ characters, 1 uppercase, 1 number, 1 special character";
    }

    // ✅ Confirm password match
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const { confirmPassword, ...userData } = formData;
      const res = await axios.post('http://localhost:5000/api/users/register', userData);
      alert(res.data.message);
      navigate("/");
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
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

        <input name="phone" type="text" placeholder="Phone Number" required onChange={handleChange} /><br />
        {errors.phone && <p style={{ color: 'red' }}>{errors.phone}</p>}

        <select name="gender" required onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select><br />

        <input name="password" type="password" placeholder="Password" required onChange={handleChange} /><br />
        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}

        <input name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} /><br />
        {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
