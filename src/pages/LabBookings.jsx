// src/pages/LabBookings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
  FiCalendar, FiEye, FiSearch, FiX, FiLoader, 
  FiChevronLeft, FiChevronRight, FiRefreshCw, FiDownload,
  FiFilter, FiCheckCircle, FiClock, FiUser, FiMapPin,
  FiDollarSign, FiPrinter, FiHome, FiActivity, FiFileText
} from 'react-icons/fi';
import { FaFlask, FaSyringe, FaMicroscope, FaFilePdf } from 'react-icons/fa';

const API_URL = 'https://userside-x164.onrender.com/api';

const LabBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [collectionFilter, setCollectionFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0
  });

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings based on search, status, payment, date
  useEffect(() => {
    let result = [...bookings];
    
    // Search filter
    if (searchTerm.trim() !== '') {
      result = result.filter(booking =>
        booking._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.testName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(booking => booking.status === statusFilter);
    }
    
    // Payment filter
    if (paymentFilter !== 'ALL') {
      result = result.filter(booking => booking.paymentStatus === paymentFilter);
    }
    
    // Collection type filter
    if (collectionFilter !== 'ALL') {
      result = result.filter(booking => booking.sampleCollectionType === collectionFilter);
    }
    
    // Date range filter
    if (dateRange.start) {
      result = result.filter(booking => new Date(booking.scheduledDate) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      result = result.filter(booking => new Date(booking.scheduledDate) <= new Date(dateRange.end));
    }
    
    // Sort by newest first
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredBookings(result);
    setCurrentPage(1);
  }, [searchTerm, bookings, statusFilter, paymentFilter, collectionFilter, dateRange]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/lab-bookings/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const bookingsData = response.data.data || [];
        setBookings(bookingsData);
        calculateStats(bookingsData);
      } else {
        toast.error(response.data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookingsData) => {
    const total = bookingsData.length;
    const pending = bookingsData.filter(b => b.status === 'Pending').length;
    const confirmed = bookingsData.filter(b => b.status === 'Confirmed').length;
    const completed = bookingsData.filter(b => b.status === 'Completed').length;
    const cancelled = bookingsData.filter(b => b.status === 'Cancelled').length;
    const totalRevenue = bookingsData
      .filter(b => b.paymentStatus === 'PAID' && b.status !== 'Cancelled')
      .reduce((sum, b) => sum + (b.price || 0), 0);
    
    setStats({ total, pending, confirmed, completed, cancelled, totalRevenue });
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`${API_URL}/lab-bookings/${bookingId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success(`Booking status updated to ${newStatus}`);
        fetchBookings();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error(error.response?.data?.message || 'Failed to update booking status');
    }
  };

  const updateReport = async (bookingId, reportUrl) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`${API_URL}/lab-bookings/${bookingId}/report`, 
        { reportUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('Report uploaded successfully');
        fetchBookings();
      }
    } catch (error) {
      console.error('Error uploading report:', error);
      toast.error('Failed to upload report');
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleRefresh = () => {
    fetchBookings();
    toast.success('Refreshed successfully');
  };

  const handleExport = () => {
    const exportData = filteredBookings.map(booking => ({
      'Booking ID': booking._id,
      'Test Name': booking.testName,
      'Price': booking.price,
      'Status': booking.status,
      'Sample Collection': booking.sampleCollectionType,
      'Scheduled Date': new Date(booking.scheduledDate).toLocaleString(),
      'Payment Method': booking.paymentMethod,
      'Payment Status': booking.paymentStatus,
      'Created At': new Date(booking.createdAt).toLocaleString(),
      'User Name': booking.user?.name || 'N/A',
      'User Email': booking.user?.email || 'N/A'
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lab-bookings-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'Sample Collected': 'bg-purple-100 text-purple-800',
      'Processing': 'bg-indigo-100 text-indigo-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PAID': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <FiClock size={14} />;
      case 'Confirmed': return <FiCheckCircle size={14} />;
      case 'Completed': return <FaMicroscope size={14} />;
      default: return <FiActivity size={14} />;
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  return (
    <div className="lab-bookings-container">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
          },
        }}
      />
      
      <div className="content-wrapper">
        {/* Header Section */}
        <div className="header-section">
          <div className="header-top">
            <div className="header-title-group">
              <div className="header-icon">
                <FaFlask size={28} />
              </div>
              <div>
                <h1 className="header-title">Lab Bookings</h1>
                <p className="header-subtitle">Manage and track all laboratory test bookings</p>
              </div>
            </div>
            
            <div className="header-actions">
              <button onClick={handleRefresh} className="action-btn" title="Refresh">
                <FiRefreshCw size={18} />
              </button>
              <button onClick={handleExport} className="action-btn" title="Export">
                <FiDownload size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Total Bookings</p>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="stat-icon purple">
              <FaFlask size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Pending</p>
              <p className="stat-value">{stats.pending}</p>
            </div>
            <div className="stat-icon yellow">
              <FiClock size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Completed</p>
              <p className="stat-value">{stats.completed}</p>
            </div>
            <div className="stat-icon green">
              <FiCheckCircle size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Total Revenue</p>
              <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="stat-icon orange">
              <FiDollarSign size={20} />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="search-filters-card">
          <div className="search-filters-row">
            <div className="search-wrapper">
              <FiSearch className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search by Booking ID, Test Name, or User..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="clear-search">
                  <FiX size={16} />
                </button>
              )}
            </div>
            
            <div className="filters-group">
              <button onClick={() => setShowFilters(!showFilters)} className="filter-toggle-btn">
                <FiFilter size={16} />
                Filters
              </button>
              <button onClick={handleRefresh} className="refresh-btn">
                <FiRefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="filter-panel">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Sample Collected">Sample Collected</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              
              <select 
                value={paymentFilter} 
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Payments</option>
                <option value="PENDING">Payment Pending</option>
                <option value="PAID">Paid</option>
                <option value="FAILED">Failed</option>
              </select>
              
              <select 
                value={collectionFilter} 
                onChange={(e) => setCollectionFilter(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Collection Types</option>
                <option value="Home">Home Collection</option>
                <option value="Lab Visit">Lab Visit</option>
              </select>
              
              <input
                type="date"
                placeholder="Start Date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="filter-date"
              />
              
              <input
                type="date"
                placeholder="End Date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="filter-date"
              />
              
              <button 
                onClick={() => {
                  setStatusFilter('ALL');
                  setPaymentFilter('ALL');
                  setCollectionFilter('ALL');
                  setDateRange({ start: '', end: '' });
                }} 
                className="clear-filters-btn"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <FiLoader className="spinner" size={48} />
            <p>Loading bookings...</p>
          </div>
        )}

        {/* Bookings Table */}
        {!loading && (
          <>
            {filteredBookings.length > 0 ? (
              <div className="bookings-table-container">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Test Details</th>
                      <th>Price</th>
                      <th>Collection</th>
                      <th>Schedule</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((booking) => (
                      <tr key={booking._id}>
                        <td className="booking-id">
                          <code>#{booking._id?.slice(-8)}</code>
                        </td>
                        <td>
                          <div className="test-info">
                            <div className="test-icon">
                              <FaSyringe size={20} />
                            </div>
                            <div>
                              <div className="test-name">{booking.testName}</div>
                              <div className="user-name">{booking.user?.name || 'User'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="price">₹{booking.price?.toLocaleString()}</td>
                        <td>
                          <div className="collection-badge">
                            {booking.sampleCollectionType === 'Home' ? (
                              <><FiHome size={12} /> Home</>
                            ) : (
                              <><FiMapPin size={12} /> Lab Visit</>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="schedule-info">
                            <FiCalendar size={12} />
                            {new Date(booking.scheduledDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div className="payment-info">
                            <span className={`payment-status ${getPaymentStatusColor(booking.paymentStatus)}`}>
                              {booking.paymentStatus}
                            </span>
                            <div className="payment-method">{booking.paymentMethod}</div>
                          </div>
                        </td>
                        <td>
                          <div className="status-dropdown">
                            <select
                              value={booking.status}
                              onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                              className={`status-select ${getStatusColor(booking.status)}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Sample Collected">Sample Collected</option>
                              <option value="Processing">Processing</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              onClick={() => handleViewDetails(booking)} 
                              className="icon-btn view"
                              title="View Details"
                            >
                              <FiEye size={16} />
                            </button>
                            <button 
                              onClick={() => window.print()} 
                              className="icon-btn print"
                              title="Print Invoice"
                            >
                              <FiPrinter size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaFlask size={48} />
                </div>
                <h3>No bookings found</h3>
                <p>No lab bookings match your search criteria.</p>
              </div>
            )}

            {/* Pagination */}
            {filteredBookings.length > itemsPerPage && (
              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="page-nav"
                >
                  <FiChevronLeft size={18} />
                </button>
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`page-number ${currentPage === number ? 'active' : ''}`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="page-nav"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Booking Details Modal */}
        {isDetailModalOpen && selectedBooking && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsDetailModalOpen(false); }}>
            <div className="modal-content detail-modal">
              <div className="modal-header">
                <div className="modal-header-icon">
                  <FaFlask size={20} />
                </div>
                <h2>Lab Booking Details</h2>
                <button onClick={() => setIsDetailModalOpen(false)} className="modal-close">
                  <FiX size={22} />
                </button>
              </div>
              
              <div className="detail-body">
                {/* Booking Info */}
                <div className="detail-section">
                  <h3 className="section-title">
                    <FaFlask size={16} />
                    Booking Information
                  </h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Booking ID</span>
                      <span className="detail-value"><code>{selectedBooking._id}</code></span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Created Date</span>
                      <span className="detail-value">{new Date(selectedBooking.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Test Name</span>
                      <span className="detail-value">{selectedBooking.testName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status</span>
                      <span className={`detail-value status-badge ${getStatusColor(selectedBooking.status)}`}>
                        {getStatusIcon(selectedBooking.status)} {selectedBooking.status}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Price</span>
                      <span className="detail-value price">₹{selectedBooking.price?.toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Scheduled Date</span>
                      <span className="detail-value">{new Date(selectedBooking.scheduledDate).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Patient Info */}
                <div className="detail-section">
                  <h3 className="section-title">
                    <FiUser size={16} />
                    Patient Information
                  </h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Name</span>
                      <span className="detail-value">{selectedBooking.user?.name || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{selectedBooking.user?.email || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">{selectedBooking.user?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Sample Collection Info */}
                <div className="detail-section">
                  <h3 className="section-title">
                    <FiHome size={16} />
                    Sample Collection
                  </h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Collection Type</span>
                      <span className="detail-value">
                        {selectedBooking.sampleCollectionType === 'Home' ? 'Home Collection' : 'Lab Visit'}
                      </span>
                    </div>
                    {selectedBooking.sampleCollectionType === 'Home' && (
                      <div className="detail-item full-width">
                        <span className="detail-label">Address</span>
                        <span className="detail-value">{selectedBooking.address || 'Address not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="detail-section">
                  <h3 className="section-title">
                    <FiDollarSign size={16} />
                    Payment Information
                  </h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Payment Method</span>
                      <span className="detail-value">{selectedBooking.paymentMethod}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Payment Status</span>
                      <span className={`detail-value ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                        {selectedBooking.paymentStatus}
                      </span>
                    </div>
                    {selectedBooking.razorpayPaymentId && (
                      <div className="detail-item">
                        <span className="detail-label">Payment ID</span>
                        <span className="detail-value"><code>{selectedBooking.razorpayPaymentId}</code></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Report Section */}
                <div className="detail-section">
                  <h3 className="section-title">
                    <FaFilePdf size={16} />
                    Test Report
                  </h3>
                  {selectedBooking.reportUrl ? (
                    <div className="report-link">
                      <a href={selectedBooking.reportUrl} target="_blank" rel="noopener noreferrer" className="report-btn">
                        <FaFilePdf size={16} />
                        Download Report
                      </a>
                    </div>
                  ) : (
                    <div className="no-report">
                      <p>No report uploaded yet</p>
                      <button 
                        onClick={() => {
                          const url = prompt('Enter report URL:');
                          if (url) updateReport(selectedBooking._id, url);
                        }}
                        className="upload-report-btn"
                      >
                        <FiFileText size={14} />
                        Upload Report
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="detail-actions">
                <button 
                  onClick={() => {
                    setIsDetailModalOpen(false);
                  }} 
                  className="detail-close-btn"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .lab-bookings-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%);
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .header-section {
          margin-bottom: 32px;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-title-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          padding: 14px;
          border-radius: 20px;
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3);
        }

        .header-icon svg {
          color: white;
        }

        .header-title {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .header-subtitle {
          font-size: 14px;
          color: #64748b;
          margin-top: 4px;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          padding: 10px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #f8fafc;
          color: #3b82f6;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 28px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #e2e8f0;
        }

        .stat-label {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 6px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.purple { background: #eef2ff; color: #8b5cf6; }
        .stat-icon.yellow { background: #fef3c7; color: #f59e0b; }
        .stat-icon.green { background: #ecfdf5; color: #10b981; }
        .stat-icon.orange { background: #fff7ed; color: #f97316; }

        .search-filters-card {
          background: white;
          border-radius: 24px;
          padding: 20px;
          margin-bottom: 28px;
          border: 1px solid #e2e8f0;
        }

        .search-filters-row {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-wrapper {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          padding: 12px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          font-size: 14px;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .clear-search {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
        }

        .filters-group {
          display: flex;
          gap: 12px;
        }

        .filter-toggle-btn, .refresh-btn {
          padding: 10px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .filter-panel {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-select, .filter-date {
          padding: 10px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          flex: 1;
          min-width: 150px;
        }

        .clear-filters-btn {
          padding: 10px 20px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 14px;
          cursor: pointer;
        }

        .bookings-table-container {
          background: white;
          border-radius: 24px;
          overflow: auto;
          border: 1px solid #e2e8f0;
        }

        .bookings-table {
          width: 100%;
          border-collapse: collapse;
        }

        .bookings-table th {
          text-align: left;
          padding: 16px 20px;
          background: #f8fafc;
          font-weight: 600;
          font-size: 13px;
          color: #475569;
          border-bottom: 1px solid #e2e8f0;
        }

        .bookings-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        .bookings-table tr:hover {
          background: #eff6ff;
        }

        .booking-id code {
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
        }

        .test-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .test-icon {
          width: 40px;
          height: 40px;
          background: #dbeafe;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
        }

        .test-name {
          font-weight: 600;
          color: #1e293b;
        }

        .user-name {
          font-size: 12px;
          color: #64748b;
        }

        .price {
          font-weight: 600;
          color: #10b981;
        }

        .collection-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: #f1f5f9;
          border-radius: 20px;
          font-size: 12px;
        }

        .schedule-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #64748b;
        }

        .payment-status {
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 500;
          display: inline-block;
        }

        .payment-method {
          font-size: 11px;
          color: #64748b;
          margin-top: 4px;
        }

        .status-select {
          padding: 6px 10px;
          border: none;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .icon-btn {
          padding: 6px;
          background: none;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .icon-btn.view { color: #3b82f6; }
        .icon-btn.print { color: #8b5cf6; }

        .loading-state {
          background: white;
          border-radius: 24px;
          padding: 80px;
          text-align: center;
        }

        .spinner {
          animation: spin 1s linear infinite;
          color: #3b82f6;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .empty-state {
          background: white;
          border-radius: 24px;
          padding: 60px;
          text-align: center;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: #dbeafe;
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #3b82f6;
        }

        .pagination {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 32px;
        }

        .page-nav {
          padding: 10px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 12px;
          cursor: pointer;
        }

        .page-numbers {
          display: flex;
          gap: 6px;
        }

        .page-number {
          width: 38px;
          height: 38px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 12px;
          cursor: pointer;
        }

        .page-number.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 32px;
          max-width: 700px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          position: sticky;
          top: 0;
        }

        .modal-header-icon {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px;
          border-radius: 14px;
        }

        .modal-header h2 {
          flex: 1;
          font-size: 20px;
        }

        .modal-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 10px;
          padding: 6px;
          cursor: pointer;
          color: white;
        }

        .detail-body {
          padding: 24px;
        }

        .detail-section {
          margin-bottom: 24px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #dbeafe;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }

        .detail-item.full-width {
          grid-column: span 2;
        }

        .detail-label {
          color: #64748b;
          font-size: 13px;
        }

        .detail-value {
          font-weight: 500;
          color: #1e293b;
        }

        .detail-value.price {
          color: #10b981;
          font-size: 18px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 8px;
        }

        .report-link {
          margin-top: 8px;
        }

        .report-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #ef4444;
          color: white;
          text-decoration: none;
          border-radius: 10px;
          font-size: 14px;
        }

        .no-report {
          text-align: center;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .no-report p {
          color: #64748b;
          margin-bottom: 12px;
        }

        .upload-report-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }

        .detail-actions {
          display: flex;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #f1f5f9;
          position: sticky;
          bottom: 0;
          background: white;
        }

        .detail-close-btn {
          flex: 1;
          padding: 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .content-wrapper {
            padding: 20px 16px;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .bookings-table th, .bookings-table td {
            padding: 12px;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
          
          .detail-item.full-width {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LabBookings;