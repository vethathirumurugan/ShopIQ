import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', sort: '', priceRange: '' });
  // Price ranges for filtering
  const priceOptions = [
    { label: 'Filter by Price', min: '', max: '', placeholder: true },
    { label: '100 - 500', min: 100, max: 500 },
    { label: '500 - 1000', min: 500, max: 1000 },
    { label: '1000 - 2000', min: 1000, max: 2000 },
    { label: '2000 - 4000', min: 2000, max: 4000 },
    { label: '4000 - 10000', min: 4000, max: 10000 },
    { label: 'Above 10000', min: 10000, max: Infinity }
  ];
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [profile, setProfile] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const limit = 8;

  const handleLogout = () => {
    localStorage.removeItem('customerEmail');
    navigate('/');
  };

  // ✅ Fetch customer profile
  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem("customerEmail");
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
      let priceMin, priceMax;
      if (filters.priceRange) {
        const selected = priceOptions.find(opt => opt.label === filters.priceRange);
        if (selected && selected.min !== '') {
          priceMin = selected.min;
          priceMax = selected.max === Infinity ? 99999999 : selected.max;
        }
      }
      const params = { ...filters, page, limit };
      if (priceMin !== undefined && priceMax !== undefined) {
        params.priceMin = priceMin;
        params.priceMax = priceMax;
      }
      const res = await axios.get(`http://localhost:5000/api/customer/products`, { params });
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  // ✅ Fetch cart items
  const fetchCart = async () => {
    const email = localStorage.getItem("customerEmail");
    try {
      const res = await axios.get(`http://localhost:5000/api/customer/cart?email=${email}`);
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart", err);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

  // Fetch cart on mount to keep cart count up-to-date
  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Add to Cart
  const addToCart = async (productId) => {
    const email = localStorage.getItem("customerEmail");
    if (!email) {
      alert("Please login to add to cart");
      return;
    }
    if (!productId) {
      alert("Invalid product");
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/customer/cart`, {
        email,
        productId,
        quantity: 1
      });
      fetchCart();
      setShowCart(true); // Open the cart modal after adding
      alert("Added to cart!");
    } catch (err) {
      alert("Failed to add to cart");
      console.error("Error adding to cart", err);
    }
  };

  // ❌ Remove from Cart
  const removeFromCart = async (productId) => {
    const email = localStorage.getItem("customerEmail");
    try {
      await axios.delete(`http://localhost:5000/api/customer/cart`, {
        data: { email, productId }
      });
      fetchCart();
    } catch (err) {
      console.error("Error removing from cart", err);
    }
  };

  // ✅ Place Order
  const placeOrder = async () => {
    const email = localStorage.getItem("customerEmail");
    try {
      await axios.post(`http://localhost:5000/api/customer/orders`, { email });
      alert("Order placed successfully!");
      fetchCart(); // Clear cart after placing order
      setShowCart(false);
    } catch (err) {
      console.error("Error placing order", err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* 🔓 Logout + Cart Button */}
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#dc3545',
            color: '#fff',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Logout
        </button>
        <button
          onClick={() => { fetchCart(); setShowCart(true); }}
          style={{
            backgroundColor: '#ff9900',
            color: '#111',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🛒 Cart ({cart.length})
        </button>
      </div>

      {/* 👤 Customer Profile */}
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


      {/* 🗂️ Category Filter */}
      <select onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
        <option value="">All Categories</option>
        <option value="Clothing">Clothing</option>
        <option value="Electronics">Electronics</option>
        <option value="Mobiles">Mobiles</option>
        <option value="Home Appliances">Home Appliances</option>
        <option value="Furniture">Furniture</option>
        <option value="Toys">Toys</option>
        <option value="Books">Books</option>
        <option value="Grocery">Grocery</option>
        <option value="Footwear">Footwear</option>
        <option value="Beauty">Beauty</option>
        <option value="Sports">Sports</option>
        <option value="Jewellery">Jewellery</option>
        <option value="Watches">Watches</option>
        <option value="Stationery">Stationery</option>
        <option value="Vegetables">Vegetables</option>
        <option value="Automotive">Automotive</option>
        <option value="Health">Health</option>
        <option value="Baby Care">Baby Care</option>
        <option value="Kitchen">Kitchen</option>
        <option value="Bags">Bags</option>
      </select>

      {/* 💸 Price Filter Dropdown */}
      <select
        value={filters.priceRange}
        onChange={e => setFilters({ ...filters, priceRange: e.target.value })}
        style={{ margin: '10px 0', padding: '8px', borderRadius: 6, border: '1px solid #1976f2', fontSize: '1rem' }}
      >
        {priceOptions.map((opt, idx) => (
          <option
            key={opt.label}
            value={idx === 0 ? '' : opt.label}
            disabled={!!opt.placeholder}
            hidden={!!opt.placeholder && filters.priceRange}
          >
            {opt.label}
          </option>
        ))}
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
            <br />
            <button
              onClick={() => addToCart(p._id)}
              style={{
                background: 'linear-gradient(90deg, #2874f0 0%, #1e88e5 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '2px',
                padding: '8px 0',
                width: '100%',
                fontWeight: 600,
                fontSize: '1rem',
                marginTop: '10px',
                boxShadow: '0 2px 8px rgba(40,116,240,0.08)',
                letterSpacing: '0.5px',
                transition: 'background 0.2s, transform 0.1s',
                cursor: 'pointer',
                outline: 'none',
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24"><path d="M7 18c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm-12.293-2.707l1.414 1.414c.195.195.451.293.707.293h12c.552 0 1-.447 1-1s-.448-1-1-1h-11.586l-.707-.707-3-3c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414l3 3zm15.293-7.293c0-1.104-.896-2-2-2h-13c-1.104 0-2 .896-2 2v2c0 .553.447 1 1 1h1v7c0 1.104.896 2 2 2h10c1.104 0 2-.896 2-2v-7h1c.553 0 1-.447 1-1v-2zm-2 9c0 .553-.447 1-1 1h-10c-.553 0-1-.447-1-1v-7h12v7zm2-9h-16v-2c0-1.104.896-2 2-2h12c1.104 0 2 .896 2 2v2z"/></svg>
                Add to Cart
              </span>
            </button>
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

      {/* 🛒 Cart Modal */}
      {showCart && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            width: '400px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3>Your Cart</h3>
            {cart.length === 0 ? (
              <p>No items in cart</p>
            ) : (
              cart.map(item => (
                <div key={item._id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '5px'
                }}>
                  <span>{item.productName}</span>
                  <span>₹{item.price}</span>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    style={{
                      background: 'red',
                      color: '#fff',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ❌
                  </button>
                </div>
              ))
            )}
            <hr />
            {cart.length > 0 && (
              <button
                onClick={placeOrder}
                style={{
                  background: 'green',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ✅ Place Order
              </button>
            )}
            <button
              onClick={() => setShowCart(false)}
              style={{
                marginLeft: '10px',
                background: '#555',
                color: '#fff',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
