import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(formData.username, formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-vh-100 animate-fade-in" style={{ minHeight: '100vh', display: 'flex' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ display: 'inline-flex', padding: '16px', borderRadius: 'var(--radius-full)', background: 'rgba(99, 102, 241, 0.1)', marginBottom: '16px' }}>
                        <UserPlus size={32} color="var(--accent-primary)" />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Start your offline OCR & Translation journey</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="form-input"
                                style={{ paddingLeft: '40px' }}
                                placeholder="johndoe"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                style={{ paddingLeft: '40px' }}
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                style={{ paddingLeft: '40px' }}
                                placeholder="••••••••"
                                required
                                minLength="6"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '12px' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '500' }}>Sign in instead</Link>
                </div>
            </div>


            {/* Rightside */}

             <div
        style={{
          width: "70%",
        //   background: "linear-gradient(135deg,#020617,#0f172a)",
          padding: "48px",
          boxSizing: "border-box",
          overflowY: "auto",
          alignContent: "space-between",
          marginLeft: "200px" 
        }}
      >
        <h1 style={{  letterSpacing: '0.5px', marginTop: 200 }}>Welcome to
                    <span className="text-gradient" style={{  letterSpacing: '0.5px' }}>  Offline IntelliExtract</span>
                </h1>

        <p style={{ maxWidth: "700px", lineHeight: 1.7, color: "#cbd5f5" }}>
          Create an account to start using offline OCR and local neural
          translation with complete data privacy.
        </p>

        <ul
          style={{
            marginTop: "24px",
            lineHeight: 2,
            color: "#94a3b8"
          }}
        >
          <li>✔ Image, PDF and document OCR</li>
          <li>✔ Local neural translation</li>
          <li>✔ Downloadable activity history</li>
          <li>✔ Fully offline processing</li>
        </ul>
      </div>

        </div>
    );
};

export default Register;
