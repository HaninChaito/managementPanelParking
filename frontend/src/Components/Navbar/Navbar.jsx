import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          <img src="src/assets/lu-logo.jpg" alt="Lebanese University Logo" className="logo" />
        </div>
        <h1 className="site-title">
          نظام تصاريح دخول المركبات إلى مجمّع الحدث  - الجامعة اللبنانية - منصّة إدارة الطّلبات
        </h1>
      </div>

      {token && (
        <div className="nav-links-container">
          <Link to="/RequestsTable" className="nav-link">طلبات تصاريخ الدّخول </Link>
          <Link to="/RequestsHistory" className="nav-link">سجلّ جميع الطلبات </Link>
          <Link to="/VisitorRequestForm" className="nav-link">تقديم طلب</Link>
          <Link to="/AddManagerForm" className="nav-link">اضافة مدقق</Link>
          <button onClick={handleLogout} className="nav-link logout-btn">تسجيل خروج</button>
        </div>
      )}
    </nav>
  );
}
