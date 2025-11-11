import { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [credentials, setCredentials] = useState({
    Email: "",
    Password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/RequestsTable");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5001/register/login",
        credentials
      );
      if (response.data.msg === "success") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/RequestsTable");
      } else {
        setMessage(response.data.msg);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.msg || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">تسجيل الدخول</h2>
            <p className="login-subtitle">
              نظام تصاريح دخول المركبات - الجامعة اللبنانية
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {message && <p className="login-message">{message}</p>}

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="Email"
                required
                className="form-input"
                value={credentials.Email}
                onChange={handleInputChange}
                placeholder="أدخل البريد الإلكتروني"
                dir="rtl"
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                name="Password"
                required
                className="form-input"
                value={credentials.Password}
                onChange={handleInputChange}
                placeholder="أدخل كلمة المرور"
                dir="rtl"
              />
            </div>

            {/* Login Button */}
            <button type="submit" className="login-button">
              تسجيل الدخول
            </button>
          </form>

<div className="register-link" style={{ marginTop: '1rem', textAlign: 'center' }}>
  <p>
    ليس لديك حساب؟{' '}
    <span 
      onClick={() => navigate('/CreateAccount')} 
      style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
    >
      اضغط هنا لإنشاء حساب
    </span>
  </p>
</div>


        </div>
      </div>
    </div>
  );
}
