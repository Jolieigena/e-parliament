import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Video, 
  FileSignature, 
  Vote, 
  Users, 
  ShieldCheck, 
  FileText, 
  UserCheck, 
  Lock 
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="nav-left">
          <div className="logo">
            <Building2 size={24} color="var(--accent)" />
            <span>E-Parliament</span>
          </div>
          <div className="nav-links">
            <span>Features <span className="caret">v</span></span>
            <span>Pricing</span>
            <span>Security</span>
            <span>Support <span className="caret">v</span></span>
          </div>
        </div>
        <div className="nav-right">
          <span className="discover-link">Discover Platform <span className="caret">v</span></span>
          <Link to="/signup" className="btn-nav-primary">
            Get E-Parliament
          </Link>
          <Link to="/signin" className="nav-signin">
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <h1>The definitive digital parliamentary system</h1>
        <p>
          Securely draft, debate, and vote on legislative documents with E-Parliament, 
          the end-to-end encrypted governance platform trusted by nations.
        </p>
        
        <div className="hero-actions">
          <Link to="/signup" className="btn btn-primary">
            Get for Assembly
          </Link>
          <Link to="/signup" className="btn btn-outline">
            Get for Committees
          </Link>
        </div>

        <div className="trust-row">
          <div className="trust-item">
            <Users size={20} color="var(--accent)" />
            <span>Trusted by over 50 governments and organizations</span>
          </div>
          <div className="trust-item">
            <ShieldCheck size={20} color="var(--accent)" />
            <span>ISO 27001 Certified Security</span>
          </div>
        </div>
      </section>

      {/* Showcase Section with CSS Laptop and Dashboard UI */}
      <section className="showcase-section">
        <div className="css-macbook">
          <div className="laptop-glow"></div>
          <div className="macbook-screen-frame">
            <div className="macbook-notch"></div>
            
            {/* Dashboard UI Overlay on Laptop Screen */}
            <div className="macbook-screen-content">
              {/* Dashboard Header */}
              <div style={{ padding: '0.5rem 1rem', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Building2 size={16} color="var(--primary)" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>E-Parliament Dashboard</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ width: '6px', height: '6px', background: '#dc2626', borderRadius: '50%', display: 'inline-block' }}></span>
                    Session 104 Live
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Hon. Representative</span>
                </div>
              </div>

              {/* Dashboard Body */}
              <div style={{ display: 'flex', flex: 1, padding: '1rem', gap: '1rem', overflow: 'hidden' }}>
                {/* Left Column: Video & Voting */}
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Video Conference Box */}
                  <div style={{ flex: 1, background: '#1e293b', borderRadius: '8px', overflow: 'hidden', position: 'relative', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '2px', background: '#000' }}>
                       <div style={{ background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserCheck size={24} color="#94a3b8" /></div>
                       <div style={{ background: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserCheck size={24} color="#cbd5e1" /></div>
                       <div style={{ background: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserCheck size={24} color="#cbd5e1" /></div>
                       <div style={{ background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserCheck size={24} color="#94a3b8" /></div>
                    </div>
                    <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', backdropFilter: 'blur(4px)' }}>
                      Live: Floor Debate
                    </div>
                  </div>
                  
                  {/* Active Voting Box */}
                  <div style={{ height: '70px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                     <div>
                       <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Motion</div>
                       <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>Amend Bill 42-A</div>
                     </div>
                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                       <div style={{ padding: '0.35rem 0.75rem', background: '#dcfce7', color: '#16a34a', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Aye: 45</div>
                       <div style={{ padding: '0.35rem 0.75rem', background: '#fee2e2', color: '#dc2626', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Nay: 12</div>
                     </div>
                  </div>
                </div>

                {/* Right Column: Bills */}
                <div style={{ flex: 1.2, background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '0.75rem', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Legislative Bills</span>
                    <FileText size={14} color="#64748b" />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ padding: '0.6rem', border: '1px solid #f1f5f9', borderRadius: '6px', background: '#fafaf9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.6rem', color: '#6366f1', fontWeight: 600, padding: '0.15rem 0.4rem', background: '#e0e7ff', borderRadius: '4px' }}>Priority High</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', margin: '0.4rem 0 0.2rem' }}>Healthcare Reform Act</div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Drafting • In Committee</div>
                    </div>
                    
                    <div style={{ padding: '0.6rem', border: '1px solid #f1f5f9', borderRadius: '6px', background: '#fafaf9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.6rem', color: '#16a34a', fontWeight: 600, padding: '0.15rem 0.4rem', background: '#dcfce7', borderRadius: '4px' }}>Ready for Vote</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', margin: '0.4rem 0 0.2rem' }}>Infrastructure Budget 2026</div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Floor • Session 104</div>
                    </div>

                    <div style={{ padding: '0.6rem', border: '1px solid #f1f5f9', borderRadius: '6px', background: '#fafaf9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.6rem', color: '#f59e0b', fontWeight: 600, padding: '0.15rem 0.4rem', background: '#fef3c7', borderRadius: '4px' }}>Review</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', margin: '0.4rem 0 0.2rem' }}>Digital Education Bill</div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Subcommittee • Pending</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="macbook-base"></div>
          
          {/* Floating UI Cards */}
          <div className="floating-card fc-1">
            <div className="fc-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
              <Video size={20} />
            </div>
            <div className="fc-text">
              <h4>Live Sessions</h4>
              <p>Virtual assembly active</p>
            </div>
          </div>

          <div className="floating-card fc-2">
            <div className="fc-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
              <FileSignature size={20} />
            </div>
            <div className="fc-text">
              <h4>Bill Draft</h4>
              <p>Energy Act 2026</p>
            </div>
          </div>

          <div className="floating-card fc-3">
            <div className="fc-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
              <Vote size={20} />
            </div>
            <div className="fc-text">
              <h4>Secure Voting</h4>
              <p>Identity verified</p>
            </div>
          </div>
        </div>
      </section>

      {/* Two Paths Section */}
      <section className="paths-section">
        <h2>Trusted by assemblies to govern with ease</h2>
        
        <div className="paths-grid">
          <div className="path-card">
            <div className="icon-wrap">
              <UserCheck size={24} />
            </div>
            <h3>For Representatives</h3>
            <p>
              Take control of your legislative duties. Keep your documents safe and participate in voting instantly with secure biometric access across any device.
            </p>
            <Link to="/signup" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.875rem' }}>
              Create a free account
            </Link>
          </div>

          <div className="path-card">
            <div className="icon-wrap">
              <Building2 size={24} />
            </div>
            <h3>For Administrators</h3>
            <p>
              Empower your assembly to work securely. Manage credentials, control role-based access, and safeguard your organization's sensitive data.
            </p>
            <Link to="/signup" className="btn btn-outline" style={{ padding: '0.6rem 1.2rem', fontSize: '0.875rem' }}>
              Get E-Parliament for Assembly
            </Link>
          </div>
        </div>
      </section>

      {/* Mini Features Section */}
      <section className="mini-features">
        <div className="mini-features-header">
          <h2>Built to protect democracy before breaches start</h2>
        </div>
        
        <div className="mf-grid">
          <div className="mf-card">
            <h4>Protect votes with encryption</h4>
            <p>Automatically encrypt votes to safeguard integrity, reduce fraud, and block tampering attempts.</p>
          </div>
          <div className="mf-card">
            <h4>Simplify session access</h4>
            <p>Securely store, auto-fill, and display 2FA codes for your representatives, saving time during logins.</p>
          </div>
          <div className="mf-card">
            <h4>Organize bills in one place</h4>
            <p>Attach files or documents to your stored sessions so you can access relevant information quickly.</p>
          </div>
          <div className="mf-card">
            <h4>Stay alert to data breaches</h4>
            <p>Receive immediate notifications if credentials appear in a third-party data leak, enabling rapid action.</p>
          </div>
          <div className="mf-card">
            <h4>Support compliance and reporting</h4>
            <p>Monitor usage, flag potential risks, and track assembly activity to ensure everyone meets security standards.</p>
          </div>
          <div className="mf-card">
            <h4>Define advanced policies</h4>
            <p>Protect sessions globally with strict access controls, device management, and detailed audit logs.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} E-Parliament System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
