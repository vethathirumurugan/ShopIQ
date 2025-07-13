import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', sort: '' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 8;

  const fetchProducts = async () => {
    const res = await axios.get(`http://localhost:5000/api/customer/products`, {
      params: { ...filters, page, limit }
    });
    setProducts(res.data.products);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Shop Products</h2>

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
          <div key={p._id} style={{ border: '1px solid #ddd', margin: 10, padding: 10, width: 200 }}>
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
