import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: '', name: '', quantity: '', pricePerUnit: '',
    description: '', image: '', category: '', subcategory: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/admin/products');
    setProducts(res.data);
    // Find products with quantity below 10
    const lowStock = (res.data || []).filter(p => Number(p.quantity) < 10);
    setLowStockProducts(lowStock);
    // Optionally, send restore alert email for low stock products (backend implementation required)
    // if (lowStock.length > 0) {
    //   await axios.post('http://localhost:5000/api/admin/restore-alert', { products: lowStock });
    // }
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

  // Update product quantity (add to existing quantity)
  const updateProductQuantity = async (id, addQty) => {
    if (!addQty || isNaN(addQty) || Number(addQty) <= 0) {
      alert("Enter a valid quantity to add");
      return;
    }
    try {
      await axios.patch(`http://localhost:5000/api/admin/products/${id}/quantity`, { addQty: Number(addQty) });
      fetchProducts();
      alert("Product quantity updated!");
    } catch (err) {
      alert("Error updating quantity");
    }
  };

  // Filter products by search term (name or productId)
  const filteredProducts = products.filter(p =>
    (!searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.productId?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>

      {/* Search bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by Name or Product ID"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #1976f2', fontSize: '1rem', width: 260 }}
        />
      </div>

      {/* Low stock alert dashboard */}
      {lowStockProducts.length > 0 && (
        <div style={{ background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba', borderRadius: 8, padding: 16, marginBottom: 20 }}>
          <strong>Restore Alert:</strong> The following products have quantity below 10:<br />
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {lowStockProducts.map(p => (
              <li key={p._id}>{p.name} (Qty: {p.quantity})</li>
            ))}
          </ul>
          <span style={{ fontSize: '0.95em' }}>
            {/* Backend should send an email to admin for these products. */}
          </span>
        </div>
      )}

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
            {filteredProducts.map(p => (
              <tr key={p._id}>
                <td><img src={p.image} alt={p.name} className="thumbnail" /></td>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
                <td>₹{p.pricePerUnit}</td>
                <td>{p.category}</td>
                <td>{p.subcategory}</td>
                <td style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <button className="delete-btn" onClick={() => deleteProduct(p._id)}>Delete</button>
                  <form onSubmit={e => {
                    e.preventDefault();
                    const addQty = e.target.elements[`addQty-${p._id}`].value;
                    updateProductQuantity(p._id, addQty);
                    e.target.reset();
                  }} style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <input
                      type="number"
                      name={`addQty-${p._id}`}
                      min="1"
                      placeholder="Add Qty"
                      style={{ width: 60, padding: '2px 6px', borderRadius: 4, border: '1px solid #1976f2', fontSize: '0.95em' }}
                    />
                    <button type="submit" style={{ background: '#1976f2', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: '0.95em', cursor: 'pointer' }}>Update</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
