import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiClock, FiMapPin, FiMonitor, FiCalendar, FiSearch, 
  FiMail, FiUser, FiActivity, FiRefreshCw 
} from 'react-icons/fi';

const LoginHistory = () => {
  const [loginData, setLoginData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDevice, setFilterDevice] = useState('all');
  const [error, setError] = useState(null);

  // Fetch login history from backend
  const fetchLoginHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try different token options
      const authToken = localStorage.getItem('adminToken') || 
                        localStorage.getItem('labToken') || 
                        localStorage.getItem('token');
      
      if (!authToken) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }

      // First try: login-history endpoint
      try {
        const response = await axios.get(
          'https://sandeeplabmanagement.onrender.com/api/laboratory-auth/login-history',
          {
            headers: { 
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          setLoginData(response.data.data || []);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log('Login history endpoint failed, trying fallback...');
      }

      // Fallback: all-laboratories endpoint
      const fallbackResponse = await axios.get(
        'https://sandeeplabmanagement.onrender.com/api/laboratory-auth/all-laboratories',
        {
          headers: { 
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (fallbackResponse.data.success && fallbackResponse.data.laboratories) {
        const formattedData = fallbackResponse.data.laboratories.map(lab => ({
          userId: lab._id,
          fullName: lab.fullName,
          email: lab.email,
          labName: lab.labName,
          lastLogin: lab.lastLogin || lab.createdAt,
          lastLoginIP: lab.lastLoginIP || 'Not recorded',
          loginHistory: lab.loginHistory || []
        }));
        setLoginData(formattedData);
      } else {
        setError('Failed to fetch laboratory data');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginHistory();
  }, []); // Empty dependency array - run once on mount

  const getDeviceIcon = (device) => {
    if (!device) return '🖥️';
    const deviceLower = device.toLowerCase();
    if (deviceLower.includes('mobile')) return '📱';
    if (deviceLower.includes('tablet')) return '📱';
    if (deviceLower.includes('mac')) return '💻';
    if (deviceLower.includes('windows')) return '💻';
    if (deviceLower.includes('linux')) return '🐧';
    return '🖥️';
  };

  const getDeviceColor = (device) => {
    if (!device) return '#6b7280';
    const deviceLower = device.toLowerCase();
    if (deviceLower.includes('mobile')) return '#8b5cf6';
    if (deviceLower.includes('tablet')) return '#8b5cf6';
    if (deviceLower.includes('mac')) return '#3b82f6';
    if (deviceLower.includes('windows')) return '#3b82f6';
    return '#6b7280';
  };

  const filteredData = loginData.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (user.fullName || '').toLowerCase().includes(searchLower) ||
      (user.email || '').toLowerCase().includes(searchLower) ||
      (user.labName || '').toLowerCase().includes(searchLower);
    
    if (filterDevice === 'all') return matchesSearch;
    
    const hasDevice = user.loginHistory && user.loginHistory.some(login => 
      login.device && login.device.toLowerCase().includes(filterDevice.toLowerCase())
    );
    return matchesSearch && hasDevice;
  });

  // Stats calculation
  const totalLabs = loginData.length;
  const activeLabs = loginData.filter(u => u.lastLogin).length;
  const mobileUsers = loginData.filter(u => 
    u.loginHistory && u.loginHistory.some(l => 
      l.device && l.device.toLowerCase().includes('mobile')
    )
  ).length;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading login history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <h3 style={styles.errorTitle}>Error Loading Data</h3>
        <p style={styles.errorMessage}>{error}</p>
        <button onClick={fetchLoginHistory} style={styles.retryButton}>
          <FiRefreshCw /> Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <FiClock style={styles.titleIcon} />
            Login History
          </h1>
          <p style={styles.subtitle}>Track laboratory user logins and activities</p>
        </div>
        <button onClick={fetchLoginHistory} style={styles.refreshBtn}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIconBg, background: '#dbeafe' }}>
            <FiUser style={{ ...styles.statIcon, color: '#3b82f6' }} />
          </div>
          <div>
            <div style={styles.statNumber}>{totalLabs}</div>
            <div style={styles.statLabel}>Total Laboratories</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statIconBg, background: '#dcfce7' }}>
            <FiActivity style={{ ...styles.statIcon, color: '#22c55e' }} />
          </div>
          <div>
            <div style={styles.statNumber}>{activeLabs}</div>
            <div style={styles.statLabel}>Active Labs</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{ ...styles.statIconBg, background: '#fce7f3' }}>
            <span style={{ ...styles.statIcon, color: '#ec4899' }}>📱</span>
          </div>
          <div>
            <div style={styles.statNumber}>{mobileUsers}</div>
            <div style={styles.statLabel}>Mobile Users</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filtersCard}>
        <div style={styles.searchBox}>
          <FiSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, email or laboratory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              style={styles.clearBtn}
            >
              ✕
            </button>
          )}
        </div>
        
        <select 
          value={filterDevice} 
          onChange={(e) => setFilterDevice(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">All Devices</option>
          <option value="mobile">📱 Mobile</option>
          <option value="desktop">💻 Desktop</option>
          <option value="tablet">📱 Tablet</option>
          <option value="mac">🍎 Mac</option>
          <option value="windows">🪟 Windows</option>
        </select>
      </div>

      {/* Results Count */}
      <div style={styles.resultsCount}>
        Showing {filteredData.length} of {totalLabs} laboratories
      </div>

      {/* Login History List */}
      {filteredData.length === 0 ? (
        <div style={styles.noResults}>
          <div style={styles.noResultsIcon}>🔍</div>
          <h3>No results found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div style={styles.historyList}>
          {filteredData.map((user) => (
            <div key={user.userId || user._id} style={styles.userCard}>
              {/* User Header */}
              <div style={styles.userHeader}>
                <div style={styles.userAvatar}>
                  {(user.fullName || user.labName || 'L').charAt(0).toUpperCase()}
                </div>
                <div style={styles.userInfo}>
                  <h3 style={styles.userName}>
                    {user.fullName || user.labName || 'Unknown'}
                  </h3>
                  <p style={styles.userEmail}>
                    <FiMail size={14} style={{ marginRight: '6px' }} />
                    {user.email || 'No email'}
                  </p>
                  {user.labName && user.labName !== (user.fullName) && (
                    <p style={styles.userLab}>
                      🏥 {user.labName}
                    </p>
                  )}
                </div>
                <div style={styles.lastLoginBadge}>
                  <FiClock size={12} />
                  <span>
                    Last Login: {user.lastLogin ? 
                      new Date(user.lastLogin).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 
                      'Never'}
                  </span>
                </div>
              </div>

              {/* Login History Table */}
              {user.loginHistory && user.loginHistory.length > 0 ? (
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Date & Time</th>
                        <th style={styles.th}>Device</th>
                        <th style={styles.th}>IP Address</th>
                        <th style={styles.th}>Browser / OS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.loginHistory.map((login, idx) => (
                        <tr key={idx} style={styles.tr}>
                          <td style={styles.td}>
                            <FiCalendar size={12} style={styles.tdIcon} />
                            {login.loginTime ? 
                              new Date(login.loginTime).toLocaleString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 
                              'Unknown'}
                          </td>
                          <td style={styles.td}>
                            <span style={{
                              ...styles.deviceBadge,
                              background: `${getDeviceColor(login.device)}15`,
                              color: getDeviceColor(login.device)
                            }}>
                              {getDeviceIcon(login.device)} {login.device || 'Unknown'}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <FiMapPin size={12} style={styles.tdIcon} />
                            {login.ipAddress || 'Unknown'}
                          </td>
                          <td style={styles.td}>
                            <FiMonitor size={12} style={styles.tdIcon} />
                            {login.userAgent ? login.userAgent.substring(0, 50) : 'Unknown'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={styles.noHistory}>
                  <p>No login history recorded yet</p>
                  <p style={{ fontSize: '11px', marginTop: '5px' }}>
                    Login history will appear after users log in
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1400px',
    margin: '0 auto',
    minHeight: '100vh',
    background: '#f5f7fa',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  title: {
    fontSize: '28px',
    color: '#1f2937',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px'
  },
  titleIcon: {
    color: '#667eea',
    fontSize: '28px'
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '14px'
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#4b5563',
    transition: 'all 0.3s'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '25px'
  },
  statCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    border: '1px solid #e5e7eb'
  },
  statIconBg: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statIcon: {
    fontSize: '24px'
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  statLabel: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '4px'
  },
  filtersCard: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  searchBox: {
    flex: 1,
    maxWidth: '400px',
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '10px 15px',
    gap: '10px',
    position: 'relative'
  },
  searchIcon: {
    color: '#9ca3af',
    fontSize: '18px'
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    background: 'transparent'
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    fontSize: '14px',
    padding: '0 5px'
  },
  filterSelect: {
    padding: '10px 15px',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '14px'
  },
  resultsCount: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '20px',
    paddingLeft: '5px'
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  userCard: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    border: '1px solid #e5e7eb'
  },
  userHeader: {
    padding: '20px',
    background: '#fafbfc',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flexWrap: 'wrap'
  },
  userAvatar: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '600',
    color: 'white'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px'
  },
  userEmail: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '2px',
    display: 'flex',
    alignItems: 'center'
  },
  userLab: {
    fontSize: '12px',
    color: '#667eea'
  },
  lastLoginBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: '#e0e7ff',
    borderRadius: '20px',
    fontSize: '12px',
    color: '#4338ca'
  },
  tableWrapper: {
    overflowX: 'auto',
    padding: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px'
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    background: '#f9fafb',
    color: '#374151',
    fontWeight: '600',
    borderBottom: '2px solid #e5e7eb',
    fontSize: '12px'
  },
  tr: {
    borderBottom: '1px solid #f3f4f6'
  },
  td: {
    padding: '12px',
    color: '#4b5563',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  tdIcon: {
    color: '#9ca3af',
    marginRight: '4px'
  },
  deviceBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '500'
  },
  noHistory: {
    padding: '30px',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '13px'
  },
  noResults: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '16px',
    border: '1px solid #e5e7eb'
  },
  noResultsIcon: {
    fontSize: '48px',
    marginBottom: '15px'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '20px',
    background: '#f5f7fa'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid #e5e7eb',
    borderTopColor: '#667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '14px'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '15px',
    background: '#f5f7fa',
    textAlign: 'center',
    padding: '20px'
  },
  errorIcon: {
    fontSize: '48px'
  },
  errorTitle: {
    fontSize: '20px',
    color: '#1f2937',
    marginBottom: '8px'
  },
  errorMessage: {
    color: '#6b7280',
    marginBottom: '20px'
  },
  retryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

// Add animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default LoginHistory;