// src/pages/Appointments.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
  FiCalendar, FiEye, FiSearch, FiX, FiLoader, 
  FiChevronLeft, FiChevronRight, FiRefreshCw, FiDownload,
  FiFilter, FiCheckCircle, FiClock, FiUser, FiVideo,
  FiMapPin, FiDollarSign, FiPrinter, FiUserCheck,
  FiAlertCircle, FiCheckSquare, FiXCircle
} from 'react-icons/fi';
import { FaUserMd, FaStethoscope, FaCalendarAlt, FaClock, FaVideo, FaHospital } from 'react-icons/fa';

const API_URL = 'https://userside-x164.onrender.com/api/appointments';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [doctorFilter, setDoctorFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    online: 0,
    inPerson: 0
  });

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchUsers();
  }, []);

  // Filter appointments
  useEffect(() => {
    let result = [...appointments];
    
    if (searchTerm.trim() !== '') {
      result = result.filter(apt =>
        apt._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'ALL') {
      result = result.filter(apt => apt.status === statusFilter);
    }
    
    if (typeFilter !== 'ALL') {
      result = result.filter(apt => apt.type === typeFilter);
    }
    
    if (doctorFilter !== 'ALL') {
      result = result.filter(apt => apt.doctorId?._id === doctorFilter);
    }
    
    if (dateRange.start) {
      result = result.filter(apt => {
        const aptDate = new Date(apt.date);
        const startDate = new Date(dateRange.start);
        return aptDate >= startDate;
      });
    }
    
    if (dateRange.end) {
      result = result.filter(apt => {
        const aptDate = new Date(apt.date);
        const endDate = new Date(dateRange.end);
        return aptDate <= endDate;
      });
    }
    
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredAppointments(result);
    setCurrentPage(1);
  }, [searchTerm, appointments, statusFilter, typeFilter, doctorFilter, dateRange]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const appointmentsData = response.data.data || [];
        setAppointments(appointmentsData);
        calculateStats(appointmentsData);
      } else {
        toast.error(response.data.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('https://userside-x164.onrender.com/api/doctors/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setDoctors(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('https://userside-x164.onrender.com/api/users/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const calculateStats = (appointmentsData) => {
    const total = appointmentsData.length;
    const pending = appointmentsData.filter(a => a.status === 'pending').length;
    const confirmed = appointmentsData.filter(a => a.status === 'confirmed').length;
    const completed = appointmentsData.filter(a => a.status === 'completed').length;
    const cancelled = appointmentsData.filter(a => a.status === 'cancelled').length;
    const online = appointmentsData.filter(a => a.type === 'online').length;
    const inPerson = appointmentsData.filter(a => a.type === 'in-person').length;
    
    setStats({ total, pending, confirmed, completed, cancelled, online, inPerson });
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`${API_URL}/${appointmentId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success(`Appointment ${newStatus}`);
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to update appointment');
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  const handleRefresh = () => {
    fetchAppointments();
    toast.success('Refreshed successfully');
  };

  const handleExport = () => {
    const exportData = filteredAppointments.map(apt => ({
      'Appointment ID': apt._id,
      'Patient Name': apt.userId?.name || 'N/A',
      'Patient Email': apt.userId?.email || 'N/A',
      'Doctor Name': apt.doctorId?.name || 'N/A',
      'Doctor Specialization': apt.doctorId?.specialization || 'N/A',
      'Date': apt.date,
      'Time': apt.time,
      'Type': apt.type === 'online' ? 'Online' : 'In-Person',
      'Status': apt.status,
      'Created At': new Date(apt.createdAt).toLocaleString()
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FiClock size={14} />;
      case 'confirmed': return <FiCheckCircle size={14} />;
      case 'completed': return <FiCheckSquare size={14} />;
      case 'cancelled': return <FiXCircle size={14} />;
      default: return <FiAlertCircle size={14} />;
    }
  };

  const getTypeIcon = (type) => {
    return type === 'online' ? <FaVideo size={14} /> : <FaHospital size={14} />;
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  return (
    <div className="appointments-container">
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
                <FaCalendarAlt size={28} />
              </div>
              <div>
                <h1 className="header-title">Appointments</h1>
                <p className="header-subtitle">Manage and track all patient appointments</p>
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
              <p className="stat-label">Total Appointments</p>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="stat-icon purple">
              <FaCalendarAlt size={20} />
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
              <p className="stat-label">Confirmed</p>
              <p className="stat-value">{stats.confirmed}</p>
            </div>
            <div className="stat-icon blue">
              <FiCheckCircle size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Completed</p>
              <p className="stat-value">{stats.completed}</p>
            </div>
            <div className="stat-icon green">
              <FiCheckSquare size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Online</p>
              <p className="stat-value">{stats.online}</p>
            </div>
            <div className="stat-icon cyan">
              <FaVideo size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">In-Person</p>
              <p className="stat-value">{stats.inPerson}</p>
            </div>
            <div className="stat-icon orange">
              <FaHospital size={20} />
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
                placeholder="Search by Patient, Doctor, or ID..."
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
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Types</option>
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
              </select>
              
              <select 
                value={doctorFilter} 
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Doctors</option>
                {doctors.map(doc => (
                  <option key={doc._id} value={doc._id}>Dr. {doc.name}</option>
                ))}
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
                  setTypeFilter('ALL');
                  setDoctorFilter('ALL');
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
            <p>Loading appointments...</p>
          </div>
        )}

        {/* Appointments Table */}
        {!loading && (
          <>
            {filteredAppointments.length > 0 ? (
              <div className="appointments-table-container">
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date & Time</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((apt) => (
                      <tr key={apt._id}>
                        <td className="apt-id">
                          <code>#{apt._id?.slice(-8)}</code>
                        </td>
                        <td>
                          <div className="patient-info">
                            <div className="patient-icon">
                              <FiUser size={16} />
                            </div>
                            <div>
                              <div className="patient-name">{apt.userId?.name || 'N/A'}</div>
                              <div className="patient-email">{apt.userId?.email || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="doctor-info">
                            <div className="doctor-icon">
                              <FaUserMd size={16} />
                            </div>
                            <div>
                              <div className="doctor-name">Dr. {apt.doctorId?.name || 'N/A'}</div>
                              <div className="doctor-specialty">{apt.doctorId?.specialization || 'General'}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="datetime-info">
                            <div><FiCalendar size={12} /> {apt.date}</div>
                            <div><FiClock size={12} /> {apt.time}</div>
                          </div>
                        </td>
                        <td>
                          <span className="type-badge">
                            {getTypeIcon(apt.type)} {apt.type === 'online' ? 'Online' : 'In-Person'}
                          </span>
                        </td>
                        <td>
                          <div className="status-dropdown">
                            <select
                              value={apt.status}
                              onChange={(e) => updateAppointmentStatus(apt._id, e.target.value)}
                              className={`status-select ${getStatusColor(apt.status)}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              onClick={() => handleViewDetails(apt)} 
                              className="icon-btn view"
                              title="View Details"
                            >
                              <FiEye size={16} />
                            </button>
                            <button 
                              onClick={() => window.print()} 
                              className="icon-btn print"
                              title="Print"
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
                  <FaCalendarAlt size={48} />
                </div>
                <h3>No appointments found</h3>
                <p>No appointments match your search criteria.</p>
              </div>
            )}

            {/* Pagination */}
            {filteredAppointments.length > itemsPerPage && (
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

        {/* Appointment Details Modal */}
        {isDetailModalOpen && selectedAppointment && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsDetailModalOpen(false); }}>
            <div className="modal-content detail-modal">
              <div className="modal-header">
                <div className="modal-header-icon">
                  <FaCalendarAlt size={20} />
                </div>
                <h2>Appointment Details</h2>
                <button onClick={() => setIsDetailModalOpen(false)} className="modal-close">
                  <FiX size={22} />
                </button>
              </div>
              
              <div className="detail-body">
                {/* Appointment Info */}
                <div className="detail-section">
                  <h3 className="section-title">
                    <FaCalendarAlt size={16} />
                    Appointment Information
                  </h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Appointment ID</span>
                      <span className="detail-value"><code>{selectedAppointment._id}</code></span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status</span>
                      <span className={`detail-value status-badge ${getStatusColor(selectedAppointment.status)}`}>
                        {getStatusIcon(selectedAppointment.status)} {selectedAppointment.status}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Date</span>
                      <span className="detail-value">{selectedAppointment.date}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Time</span>
                      <span className="detail-value">{selectedAppointment.time}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Type</span>
                      <span className="detail-value">
                        {getTypeIcon(selectedAppointment.type)} {selectedAppointment.type === 'online' ? 'Online Consultation' : 'In-Person Visit'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Created At</span>
                      <span className="detail-value">{new Date(selectedAppointment.createdAt).toLocaleString()}</span>
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
                      <span className="detail-value">{selectedAppointment.userId?.name || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{selectedAppointment.userId?.email || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">{selectedAppointment.userId?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="detail-section">
                  <h3 className="section-title">
                    <FaUserMd size={16} />
                    Doctor Information
                  </h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Name</span>
                      <span className="detail-value">Dr. {selectedAppointment.doctorId?.name || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Specialization</span>
                      <span className="detail-value">{selectedAppointment.doctorId?.specialization || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Fees</span>
                      <span className="detail-value price">₹{selectedAppointment.doctorId?.fees || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Experience</span>
                      <span className="detail-value">{selectedAppointment.doctorId?.experience || 'N/A'} years</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="detail-actions">
                <select
                  value={selectedAppointment.status}
                  onChange={(e) => {
                    updateAppointmentStatus(selectedAppointment._id, e.target.value);
                    setIsDetailModalOpen(false);
                  }}
                  className={`status-update-select ${getStatusColor(selectedAppointment.status)}`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button onClick={() => setIsDetailModalOpen(false)} className="detail-close-btn">
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

        .appointments-container {
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
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #e2e8f0;
        }

        .stat-label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.purple { background: #eef2ff; color: #8b5cf6; }
        .stat-icon.yellow { background: #fef3c7; color: #f59e0b; }
        .stat-icon.blue { background: #dbeafe; color: #3b82f6; }
        .stat-icon.green { background: #ecfdf5; color: #10b981; }
        .stat-icon.cyan { background: #cffafe; color: #06b6d4; }
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

        .appointments-table-container {
          background: white;
          border-radius: 24px;
          overflow: auto;
          border: 1px solid #e2e8f0;
        }

        .appointments-table {
          width: 100%;
          border-collapse: collapse;
        }

        .appointments-table th {
          text-align: left;
          padding: 16px 20px;
          background: #f8fafc;
          font-weight: 600;
          font-size: 13px;
          color: #475569;
          border-bottom: 1px solid #e2e8f0;
        }

        .appointments-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        .appointments-table tr:hover {
          background: #eff6ff;
        }

        .apt-id code {
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
        }

        .patient-info, .doctor-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .patient-icon, .doctor-icon {
          width: 36px;
          height: 36px;
          background: #dbeafe;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
        }

        .patient-name, .doctor-name {
          font-weight: 600;
          font-size: 14px;
          color: #1e293b;
        }

        .patient-email, .doctor-specialty {
          font-size: 11px;
          color: #64748b;
        }

        .datetime-info {
          font-size: 13px;
          color: #475569;
        }

        .datetime-info div {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .type-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f1f5f9;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-select {
          padding: 6px 12px;
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
          max-width: 600px;
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
          font-weight: 600;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .detail-actions {
          display: flex;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #f1f5f9;
        }

        .status-update-select {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 14px;
          font-weight: 600;
          cursor: pointer;
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
          
          .appointments-table th, .appointments-table td {
            padding: 12px;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Appointments;