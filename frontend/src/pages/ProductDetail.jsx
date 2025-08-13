import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const customerEmail = localStorage.getItem('customerEmail'); // assuming it's stored on login

  useEffect(() => {
    axios.get(`http://localhost:5000/api/customer/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => alert("Product not found"));
  }, [id]);
  const handlePlaceOrder = async () => {
  if (!customerEmail) {
    alert("Please login to place order");
    return;
  }
  if (quantity < 1 || quantity > product.quantity) {
    alert("Invalid quantity selected");
    return;
  }
  try {
    const res = await axios.post('http://localhost:5000/api/customer/place-order', {
      productId: id,
      quantity,
      email: customerEmail
    });
    alert(res.data.message || "Order placed successfully");
  } catch (error) {
    alert("Failed to place order");
  }
};


  const handleAddToCart = async () => {
    if (!customerEmail) {
      alert("Please login to add to cart");
      return;
    }
    if (quantity < 1 || quantity > product.quantity) {
      alert("Invalid quantity selected");
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/customer/cart', {
        productId: id,
        quantity,
        email: customerEmail
      });
      alert(res.data.message || "Item added to cart");
    } catch (error) {
      alert("Failed to add to cart");
    }
  };

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

        <div>
          <label>Quantity: </label>
          <input
            type="number"
            min="1"
            max={product.quantity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div className="action-buttons">
          <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
          <button className="place-order" onClick={handlePlaceOrder}>Place Order</button>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
