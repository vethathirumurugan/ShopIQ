import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/customer/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => alert("Product not found"));
  }, [id]);

  if (!product) return <div className="loading">Loading product...</div>;

  return (
    <div className="product-detail-container">
      <div className="image-section">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>

      <div className="info-section">
        <h2>{product.name}</h2>
        <p className="product-description">{product.description}</p>
        <p className="product-category"><strong>Category:</strong> {product.category}</p>
        <p className="product-price">₹{product.pricePerUnit}</p>
        <p className="product-quantity">Available Quantity: {product.quantity}</p>

        <div className="action-buttons">
          <button className="add-to-cart">Add to Cart</button>
          <button className="place-order">Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
