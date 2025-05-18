import React from 'react';
import './LoginPage.css'; // Certifique-se de importar seu CSS

function LoginPage() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:8000/auth/google';
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Clutch Monitor</h1>
        <button className="google-btn" onClick={handleLogin}>
          <span className="google-text">Login com Google</span>
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
