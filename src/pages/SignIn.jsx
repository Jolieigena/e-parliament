import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, LogIn } from 'lucide-react';

const SignIn = () => {
  return (
    <div className="split-page">
      <div className="split-left">
        <div className="auth-form-container glass-panel" style={{ padding: '2.5rem' }}>
          <div className="auth-header">
            <Building2 size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h1>Welcome Back</h1>
            <p>Sign in to access the E-Parliament portal</p>
          </div>
          
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input type="email" id="email" className="form-input" placeholder="representative@gov.com" required />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input type="password" id="password" className="form-input" placeholder="••••••••" required />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              <LogIn size={20} /> Sign In
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/signup">Register here</Link>
          </div>
        </div>
      </div>
      
      <div className="split-right">
        <img src="/african-union.jpg" alt="African Union" className="split-bg-image" />
        <div className="split-overlay">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Digital Legislative Assembly</h2>
          <p style={{ fontSize: '1.2rem', maxWidth: '400px', lineHeight: '1.8' }}>
            A unified secure system for representatives to draft bills, cast votes, and participate in assemblies remotely.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
