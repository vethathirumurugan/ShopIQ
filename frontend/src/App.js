import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerDashboard from './pages/CustomerDashboard';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h2>Welcome to ShopIQ</h2>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/products" element={<CustomerDashboard />} />  
        <Route path="/product/:id" element={<ProductDetail />} />

      </Routes>
    </Router>
  );
}

export default App;
