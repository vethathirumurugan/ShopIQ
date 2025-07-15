import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerDashboard from './pages/CustomerDashboard';
import ProductDetail from './pages/ProductDetail';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin/>}/>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/products" element={<CustomerDashboard />} />  
        <Route path="/product/:id" element={<ProductDetail />} />

      </Routes>
    </Router>
  );
}

export default App;
