import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:5000/api/customer/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => alert("Product not found"));
  }, [id]);

  return (
    <div style={{ padding: 20 }}>
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} width="300px" />
      <p>{product.description}</p>
      <p>Price: ₹{product.pricePerUnit}</p>
      <p>Available: {product.quantity}</p>
    </div>
  );
};

export default ProductDetail;
