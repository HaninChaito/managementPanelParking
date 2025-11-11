import React, { useState } from 'react';
import './addManager.css';

const AddManagerForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    setLoading(true);

    // Get the auth token from storage (e.g., localStorage)
    const token = localStorage.getItem('token'); 

    if (!token) {
      setError('Authentication error. Please log in again to continue.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/managers/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Add the Authorization header for the backend to identify the logged-in manager
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // The backend now provides specific error messages (e.g., faculty mismatch, already a manager)
        throw new Error(data.message || 'An unexpected error occurred.');
      }

      setMessage('Manager added successfully!');
      setEmail('');
      
    } catch (err) {
      // Display the specific error message from the backend
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-main">
      <div className="form-container">
        <h2 className="form-title">إضافة مدقق جديد</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">البريد الإلكتروني للمستخدم</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
       
          {/* This component will now display more specific errors from the backend */}
          {error && <div className="request-blocked-message">{error}</div>}
          {message && <div className="request-blocked-message" style={{ backgroundColor: '#e6ffec', borderColor: '#66bb6a' }}>{message}</div>}

          <div className="submit-wrapper">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'جارٍ الإرسال...' : 'إضافة المدقق'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddManagerForm;