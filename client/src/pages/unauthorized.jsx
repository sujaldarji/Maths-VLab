// src/pages/Unauthorized.jsx
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          color: '#dc2626',
          marginBottom: '1rem'
        }}>
          Access Denied
        </h1>
        <p style={{
          color: '#6b7280',
          marginBottom: '2rem',
          fontSize: '1.125rem'
        }}>
          You don't have permission to access this page.
        </p>
        <Link 
          to="/dashboard" 
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            display: 'inline-block',
            fontWeight: '500',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;