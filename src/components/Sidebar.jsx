

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import {
  FiHome,
  FiUser,
  FiSettings,
  FiActivity,
  FiLayers,
  FiGrid,
  FiUserPlus,
  FiFolder,
  FiClipboard,
  FiChevronDown,
  FiPocket,
  FiHeart,
  FiCreditCard,
  FiLogOut,
  FiUsers,
    FiClock,
  
} from 'react-icons/fi';

const sidebarStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

  .sb-root {
    font-family: 'Sora', sans-serif;
    width: 250px;
    min-height: 100vh;
    background: #0f172a;
    display: flex;
    flex-direction: column;
    color: white;
  }

  .sb-logo {
    padding: 20px;
    font-size: 20px;
    font-weight: 700;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .sb-nav {
    flex: 1;
    padding: 15px 10px;
    overflow-y: auto;
  }

  .sb-nav-label {
    font-size: 11px;
    color: #94a3b8;
    margin: 18px 10px 8px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 1px;
  }

  .sb-link,
  .sb-dropdown-btn,
  .sb-sub-link,
  .sb-logout-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 11px 14px;
    border-radius: 10px;
    color: #cbd5e1;
    text-decoration: none;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: 0.2s;
    font-size: 14px;
    font-weight: 500;
  }

  .sb-link:hover,
  .sb-dropdown-btn:hover,
  .sb-sub-link:hover,
  .sb-logout-btn:hover {
    background: rgba(255,255,255,0.08);
  }

  .sb-link.active,
  .sb-sub-link.active {
    background: #2563eb;
    color: white;
  }

  .sb-logout-btn {
    color: #ef4444;
    margin-top: 10px;
  }

  .sb-logout-btn:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  .sb-submenu {
    padding-left: 18px;
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .sb-dropdown-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sb-dropdown-btn {
    justify-content: space-between;
  }

  .sb-divider {
    height: 1px;
    background: rgba(255,255,255,0.08);
    margin: 14px 0;
  }

  .sb-footer {
    padding: 16px;
    border-top: 1px solid rgba(255,255,255,0.08);
    font-size: 13px;
    color: #94a3b8;
  }
`;

const mainItems = [
  { path: '/dashboard', name: 'Dashboard', icon: FiHome },
  { path: '/doctors', name: 'Doctors', icon: FiUserPlus },
  { path: '/categories', name: 'Categories', icon: FiGrid },
  { path: '/symptoms', name: 'Symptoms', icon: FiActivity },
  { path: '/users', name: 'Users', icon: FiUsers },  // <-- Add this line
  
  { path: '/online-symptoms', name: 'Online Symptoms', icon: FiActivity },
  { path: '/appointments', name: 'Appointments', icon: FiClipboard },
  { path: '/featured-services', name: 'Featured Services', icon: FiHeart },
  { path: '/offers', name: 'Offers', icon: FiPocket },
  { path: '/payments', name: 'Payments', icon: FiCreditCard },
];

const petManagementItems = {
  name: 'Pet Management',
  icon: FiPocket,

  subItems: [
    {
      path: '/pet-categories',
      name: 'Pet Categories',
      icon: FiFolder,
    },

    // {
    //   path: '/pet-products',
    //   name: 'Pet Products',
    //   icon: FiGrid,
    // },

    {
      path: '/pet-orders',
      name: 'Pet Orders',
      icon: FiClipboard,
    },
  ],
};

const labManagementItems = {
  name: 'Lab Management',
  icon: FiClipboard,

  subItems: [
    {
      path: '/lab-categories',
      name: 'Lab Categories',
      icon: FiFolder,
    },

    {
      path: '/lab-tests',
      name: 'Lab Tests',
      icon: FiClipboard,
    },
 { path: '/login-history', name: 'Lab List', icon: FiClock },
    {
      path: '/checkup-types',
      name: 'Checkup Types',
      icon: FiLayers,
    },

    {
      path: '/lab-bookings',
      name: 'Lab Bookings',
      icon: FiActivity,
    },
  ],
};

const medicineManagementItems = {
  name: 'Medicines Management',
  icon: FiGrid,

  subItems: [
    {
      path: '/medicines',
      name: 'Medicines',
      icon: FiGrid,
    },

    {
      path: '/medicine-items',
      name: 'Medicine Items',
      icon: FiClipboard,
    },

    {
      path: '/subcategories',
      name: 'Sub Categories',
      icon: FiFolder,
    },
{ path: '/pharmacy-login-history', name: 'Pharmacy Logins', icon: FiClock },
    {
      path: '/medicine-orders',
      name: 'Medicine Orders',
      icon: FiActivity,
    },
  ],
};

const healthManagementItems = {
  name: 'Health Management',
  icon: FiHeart,

  subItems: [
    {
      path: '/health-package-categories',
      name: 'Health Package Categories',
      icon: FiFolder,
    },

    {
      path: '/health-packages',
      name: 'Health Packages',
      icon: FiClipboard,
    },
  ],
};

const surgeryManagementItems = {
  name: 'Surgery Management',
  icon: FiActivity,

  subItems: [
    {
      path: '/surgery-categories',
      name: 'Surgery Categories',
      icon: FiFolder,
    },

    {
      path: '/surgeries',
      name: 'Surgeries',
      icon: FiActivity,
    },
  ],
};

const systemItems = [
  { path: '/profile', name: 'Profile', icon: FiUser },
  { path: '/settings', name: 'Settings', icon: FiSettings },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [openDropdowns, setOpenDropdowns] = useState({
    petManagement: true,
    labManagement: false,
    medicineManagement: false,
    healthManagement: false,
    surgeryManagement: false,
  });

  const toggleDropdown = (dropdownName) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdownName]: !prev[dropdownName],
    }));
  };

  const handleLogout = () => {
    // Clear all authentication data from localStorage/sessionStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // Clear any cookies if you're using them
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Redirect to login page
    navigate('/login', { replace: true });
  };

  const renderDropdown = (keyName, data) => (
    <div>
      <button
        className="sb-dropdown-btn"
        onClick={() => toggleDropdown(keyName)}
      >
        <div className="sb-dropdown-left">
          <data.icon size={16} />
          {data.name}
        </div>

        <FiChevronDown
          size={16}
          style={{
            transform: openDropdowns[keyName]
              ? 'rotate(180deg)'
              : 'rotate(0deg)',
            transition: '0.2s',
          }}
        />
      </button>

      {openDropdowns[keyName] && (
        <div className="sb-submenu">
          {data.subItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sb-sub-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon size={14} />
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{sidebarStyles}</style>

      <div className="sb-root">
        <div className="sb-logo">DocDor Admin</div>

        <nav className="sb-nav">
          {/* MAIN */}
          <div className="sb-nav-label">Main</div>

          {mainItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sb-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon size={16} />
              {item.name}
            </NavLink>
          ))}

          <div className="sb-divider" />

          {/* PET MANAGEMENT */}
          <div className="sb-nav-label">Pet Management</div>

          {renderDropdown('petManagement', petManagementItems)}

          <div className="sb-divider" />

          {/* LAB MANAGEMENT */}
          <div className="sb-nav-label">Lab Management</div>

          {renderDropdown('labManagement', labManagementItems)}

          <div className="sb-divider" />

          {/* MEDICINE MANAGEMENT */}
          <div className="sb-nav-label">Medicines Management</div>

          {renderDropdown(
            'medicineManagement',
            medicineManagementItems
          )}

          <div className="sb-divider" />

          {/* HEALTH MANAGEMENT */}
          <div className="sb-nav-label">Health Management</div>

          {renderDropdown(
            'healthManagement',
            healthManagementItems
          )}

          <div className="sb-divider" />

          {/* SURGERY MANAGEMENT */}
          <div className="sb-nav-label">Surgery Management</div>

          {renderDropdown(
            'surgeryManagement',
            surgeryManagementItems
          )}

          <div className="sb-divider" />

          {/* SYSTEM */}
          <div className="sb-nav-label">System</div>

          {systemItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sb-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon size={16} />
              {item.name}
            </NavLink>
          ))}

          <div className="sb-divider" />

          {/* LOGOUT BUTTON */}
          <button className="sb-logout-btn" onClick={handleLogout}>
            <FiLogOut size={16} />
            Logout
          </button>
        </nav>

        <div className="sb-footer">
          System Online
        </div>
      </div>
    </>
  );
};

export default Sidebar;