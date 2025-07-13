import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
      setFormData({ ...formData, image: reader.result }); // base64 string
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
    } catch (err) {
      alert("Error adding product: " + err.response?.data?.error || err.message);
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
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard - Manage Products</h2>

      <form onSubmit={addProduct} style={{ marginBottom: '20px' }}>
        {["productId", "name", "quantity", "pricePerUnit", "description", "category", "subcategory"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field}
            onChange={handleChange}
            required
            style={{ margin: '5px', padding: '8px' }}
          />
        ))}

        {/* Correct image input */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageUpload}
          required
          style={{ margin: '5px', padding: '8px' }}
        />

        <button type="submit">Add Product</button>
      </form>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>
                {p.image && (
                  <img src={p.image} alt={p.name} width="60" height="60" />
                )}
              </td>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              <td>{p.pricePerUnit}</td>
              <td>{p.category}</td>
              <td>{p.subcategory}</td>
              <td>
                <button onClick={() => deleteProduct(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
