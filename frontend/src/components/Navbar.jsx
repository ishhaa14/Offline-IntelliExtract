import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            padding: '20px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--glass-border)',
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
                }}>
                    <ScanLine size={24} color="white" />
                </div>
                <h1 style={{ fontSize: '1.4rem', fontWeight: '700', letterSpacing: '0.5px' }}>
                    Offline <span className="text-gradient">IntelliExtract</span>
                </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Welcome back,</span>
                    <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{user?.username}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)' }}
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
