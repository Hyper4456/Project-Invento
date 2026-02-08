import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const payload = {
            email: email.trim(),
            password: password.trim()
        };

        try {
            if (isRegistering) {
                // Register flow
                await api.post('/auth/register', payload);
                // Auto login after register or ask user to login. Let's auto-login for UX.
                const loginRes = await api.post('/auth/login', payload);
                localStorage.setItem('token', loginRes.data.token);
                navigate('/dashboard');
            } else {
                // Login flow
                const res = await api.post('/auth/login', payload);
                localStorage.setItem('token', res.data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            const msg = err.response?.data?.error || 'An error occurred';
            setError(msg);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
            <h1>Pharminto</h1>
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email:</label><br/>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Password:</label><br/>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    {isRegistering ? 'Sign Up' : 'Log In'}
                </button>
            </form>

            <p style={{ marginTop: '1rem' }}>
                {isRegistering ? 'Already have an account?' : 'Need an account?'}
                {' '}
                <button 
                    onClick={() => setIsRegistering(!isRegistering)}
                    style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {isRegistering ? 'Login here' : 'Register here'}
                </button>
            </p>
        </div>
    );
};

export default Login;