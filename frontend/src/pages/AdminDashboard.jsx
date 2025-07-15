import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: '', name: '', quantity: '', pricePerUnit: '',
    description: '', image: '', category: '', subcategory: ''
  });

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/admin/products');
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/products', formData);
      fetchProducts();
      alert("Product added!");
      setFormData("");
    } catch (err) {
      alert("Error adding product: " + (err.response?.data?.error || err.message));
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`);
      fetchProducts();
      alert("Product deleted!");
    } catch (err) {
      alert("Error deleting product");
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>
<form onSubmit={addProduct} className="admin-form">
  <div className="form-group">
    <label htmlFor="productId">Product ID</label>
    <input name="productId" id="productId" onChange={handleChange} required />
  </div>
  <div className="form-group">
    <label htmlFor="name">Name</label>
    <input name="name" id="name" onChange={handleChange} required />
  </div>
  <div className="form-group">
    <label htmlFor="quantity">Quantity</label>
    <input name="quantity" id="quantity" onChange={handleChange} required />
  </div>
  <div className="form-group">
    <label htmlFor="pricePerUnit">Price</label>
    <input name="pricePerUnit" id="pricePerUnit" onChange={handleChange} required />
  </div>
  <div className="form-group">
    <label htmlFor="description">Description</label>
    <input name="description" id="description" onChange={handleChange} required />
  </div>
  <div className="form-group">
    <label htmlFor="category">Category</label>
    <input name="category" id="category" onChange={handleChange} required />
  </div>
  <div className="form-group">
    <label htmlFor="subcategory">Subcategory</label>
    <input name="subcategory" id="subcategory" onChange={handleChange} required />
  </div>
  <div className="form-group">
    <label htmlFor="image">Image</label>
    <input type="file" name="image" id="image" accept="image/*" onChange={handleImageUpload} required />
  </div>

  <button type="submit" className="submit-btn">Add Product</button>
</form>

      <div className="product-table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td><img src={p.image} alt={p.name} className="thumbnail" /></td>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
                <td>₹{p.pricePerUnit}</td>
                <td>{p.category}</td>
                <td>{p.subcategory}</td>
                <td><button className="delete-btn" onClick={() => deleteProduct(p._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
