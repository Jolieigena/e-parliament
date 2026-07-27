import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, UserPlus } from 'lucide-react';

const SignUp = () => {
  return (
    <div className="split-page">
      <div className="split-left">
        <div className="auth-form-container glass-panel" style={{ padding: '2.5rem' }}>
          <div className="auth-header">
            <Building2 size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h1>Create Account</h1>
            <p>Register for the E-Parliament system</p>
          </div>
          
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input type="text" id="name" className="form-input" placeholder="Hon. John Doe" required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input type="email" id="email" className="form-input" placeholder="representative@gov.com" required />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input type="password" id="password" className="form-input" placeholder="••••••••" required />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              <UserPlus size={20} /> Register
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/signin">Sign in</Link>
          </div>
        </div>
      </div>
      
      <div className="split-right">
        <img src="/african-union.jpg" alt="African Union" className="split-bg-image" />
        <div className="split-overlay">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Join the Assembly</h2>
          <p style={{ fontSize: '1.2rem', maxWidth: '400px', lineHeight: '1.8' }}>
            Empowering modern democracy with efficient digital tools for better representation and transparency.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
