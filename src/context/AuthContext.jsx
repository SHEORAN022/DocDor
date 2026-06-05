import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const API_URL = 'https://userside-x164.onrender.com/api';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminInfo = localStorage.getItem('adminInfo');
    
    if (token && adminInfo) {
      setAdmin(JSON.parse(adminInfo));
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/admin/register`, {
        name, email, password
      });
      
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
        setAdmin(response.data.admin);
        toast.success('Registration successful!');
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        email, password
      });
      
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
        setAdmin(response.data.admin);
        toast.success('Login successful!');
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    setAdmin(null);
    toast.success('Logged out');
  };

  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`${API_URL}/admin/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const updatedAdmin = { ...admin, ...response.data.admin };
        localStorage.setItem('adminInfo', JSON.stringify(updatedAdmin));
        setAdmin(updatedAdmin);
        toast.success('Profile updated!');
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return false;
    }
  };

  const deleteAdmin = async (adminId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(`${API_URL}/admin/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        toast.success('Admin deleted');
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      admin, 
      loading, 
      register,
      login, 
      logout, 
      updateProfile,
      deleteAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};