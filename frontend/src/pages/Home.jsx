import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home= () => {
  return (
    <div className="landing-page">
      <div className="overlay">
        <div className="content-box">
          <h1>Welcome to ShopIQ</h1>
          <p>Your one-stop destination for smart online shopping. Explore the latest trends, top categories, and great deals — all in one place.</p>

          <div className="button-group">
            <Link to="/login" className="btn">Customer Login</Link>
            <Link to="/admin-login" className="btn">Admin Login</Link>
            <Link to="/register" className="btn secondary">New Customer? Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
