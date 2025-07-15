import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
    const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', sort: '' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [profile, setProfile] = useState(null);
  const limit = 8;
 const handleLogout = () => {
    localStorage.removeItem('customerEmail'); // ❌ Clear stored email
    navigate('/'); // 🔁 Redirect to login page
  };
  // ✅ Fetch customer profile from localStorage email
  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem("customerEmail"); // ✅ Make sure this is set in login
      if (!email) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/customer/profile?email=${email}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/customer/products`, {
        params: { ...filters, page, limit }
      });
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

  return (
    <div style={{ padding: '20px' }}>
      {/* 🔓 Logout Button */}
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button onClick={handleLogout} style={{
          backgroundColor: '#dc3545',
          color: '#fff',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Logout
        </button>
      </div>
      {/* 👤 Customer Profile Section */}
      {profile && (
        <div style={{
          backgroundColor: "#f9f9f9",
          padding: "15px",
          marginBottom: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px"
        }}>
          <h3>👤 Welcome, {profile.firstName} {profile.lastName}</h3>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Gender:</strong> {profile.gender}</p>
        </div>
      )}

      <h2>🛍️ Shop Products</h2>

      {/* 🔍 Search */}
      <input
        placeholder="Search..."
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        style={{ padding: '8px', margin: '10px' }}
      />

      {/* 🗂️ Filter */}
      <select onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
        <option value="">All Categories</option>
        <option value="Clothing">Clothing</option>
        <option value="Electronics">Electronics</option>
      </select>

      {/* ↕️ Sort */}
      <select onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
        <option value="">Sort</option>
        <option value="price">Price: Low to High</option>
      </select>

      {/* 📦 Product Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {products.map(p => (
          <div key={p._id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            margin: 10,
            padding: 10,
            width: 200,
            textAlign: 'center'
          }}>
            <img src={p.image} alt={p.name} width="100%" height="150px" />
            <h4>{p.name}</h4>
            <p>₹{p.pricePerUnit}</p>
            <Link to={`/product/${p._id}`}>View</Link>
          </div>
        ))}
      </div>

      {/* ⏭️ Pagination */}
      <div>
        {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
          <button key={i} onClick={() => setPage(i + 1)} style={{ margin: 5 }}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;
