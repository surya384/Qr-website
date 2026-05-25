import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            const response = await api.get('/me');
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        checkAuth();
    }, []);

    const handleGoogleLogin = React.useCallback(async (response) => {
        // Diagnostic alert to see if Google SDK even triggers the callback
        // alert('Google Callback Triggered! Checking with backend...');

        try {
            const res = await api.post('/auth/google', {
                credential: response.credential
            });

            if (res.data.token) {
                // alert('Backend Auth Success! Storing token...');
                localStorage.setItem('token', res.data.token);
                await checkAuth();
                // alert('User state updated! Redirecting...');
            } else {
                // alert('Backend success but NO TOKEN received.');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            const status = error.response?.status;
            alert(`API Error (${status}): ${errorMsg}\nURL: ${import.meta.env.VITE_API_BASE_URL}`);
            console.error('Login failed during API call:', error.response?.data || error.message);
        }
    }, []);



    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, handleGoogleLogin, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);
