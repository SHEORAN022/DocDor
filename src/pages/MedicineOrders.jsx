// src/pages/MedicineOrders.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
  FiPackage, FiEye, FiEdit2, FiSearch, FiX, FiLoader, 
  FiChevronLeft, FiChevronRight, FiRefreshCw, FiDownload,
  FiFilter, FiCheckCircle, FiClock, FiTruck, FiMapPin,
  FiUser, FiDollarSign, FiCalendar, FiShoppingBag,
  FiCreditCard, FiHome, FiPrinter
} from 'react-icons/fi';
import { FaPills, FaSyringe, FaHeartbeat, FaPrescriptionBottle } from 'react-icons/fa';

const API_URL = 'https://userside-x164.onrender.com/api';

const MedicineOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    placed: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    codAmount: 0,
    onlineAmount: 0,
    walletAmount: 0
  });

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on search, status, payment, date
  useEffect(() => {
    let result = [...orders];
    
    // Search filter
    if (searchTerm.trim() !== '') {
      result = result.filter(order =>
        order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items?.some(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(order => order.orderStatus === statusFilter);
    }
    
    // Payment status filter
    if (paymentFilter !== 'ALL') {
      result = result.filter(order => order.paymentStatus === paymentFilter);
    }
    
    // Payment method filter
    if (paymentMethodFilter !== 'ALL') {
      result = result.filter(order => order.paymentMethod === paymentMethodFilter);
    }
    
    // Date range filter
    if (dateRange.start) {
      result = result.filter(order => new Date(order.createdAt) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      result = result.filter(order => new Date(order.createdAt) <= new Date(dateRange.end));
    }
    
    // Sort by newest first
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredOrders(result);
    setCurrentPage(1);
  }, [searchTerm, orders, statusFilter, paymentFilter, paymentMethodFilter, dateRange]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/medicine-orders/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const ordersData = response.data.data || [];
        setOrders(ordersData);
        calculateStats(ordersData);
      } else {
        toast.error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const total = ordersData.length;
    const placed = ordersData.filter(o => o.orderStatus === 'PLACED').length;
    const confirmed = ordersData.filter(o => o.orderStatus === 'CONFIRMED').length;
    const shipped = ordersData.filter(o => o.orderStatus === 'SHIPPED').length;
    const delivered = ordersData.filter(o => o.orderStatus === 'DELIVERED').length;
    const cancelled = ordersData.filter(o => o.orderStatus === 'CANCELLED').length;
    
    const paidOrders = ordersData.filter(o => o.paymentStatus === 'PAID' && o.orderStatus !== 'CANCELLED');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    const codAmount = ordersData
      .filter(o => o.paymentMethod === 'COD' && o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    const onlineAmount = ordersData
      .filter(o => o.paymentMethod === 'ONLINE' && o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    const walletAmount = ordersData
      .filter(o => o.paymentMethod === 'WALLET' && o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    
    setStats({ total, placed, confirmed, shipped, delivered, cancelled, totalRevenue, codAmount, onlineAmount, walletAmount });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`${API_URL}/medicine-orders/${orderId}/status`, 
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleRefresh = () => {
    fetchOrders();
    toast.success('Refreshed successfully');
  };

  const handleExport = () => {
    const exportData = filteredOrders.map(order => ({
      'Order ID': order._id,
      'Items': order.items?.map(i => `${i.name} x${i.quantity}`).join(', '),
      'Total Amount': order.totalAmount,
      'Payment Method': order.paymentMethod,
      'Payment Status': order.paymentStatus,
      'Order Status': order.orderStatus,
      'Delivery Address': order.deliveryAddress,
      'Created At': new Date(order.createdAt).toLocaleString(),
      'User Name': order.user?.name || 'N/A',
      'User Email': order.user?.email || 'N/A'
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medicine-orders-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  const getStatusColor = (status) => {
    const colors = {
      'PLACED': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'PROCESSING': 'bg-purple-100 text-purple-800',
      'SHIPPED': 'bg-indigo-100 text-indigo-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
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

  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'COD': return <FiHome size={14} />;
      case 'ONLINE': return <FiCreditCard size={14} />;
      case 'WALLET': return <FiDollarSign size={14} />;
      default: return <FiPackage size={14} />;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PLACED': return <FiClock size={14} />;
      case 'CONFIRMED': return <FiCheckCircle size={14} />;
      case 'SHIPPED': return <FiTruck size={14} />;
      case 'DELIVERED': return <FiPackage size={14} />;
      default: return <FiPackage size={14} />;
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="medicine-orders-container">
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
                <FaPills size={28} />
              </div>
              <div>
                <h1 className="header-title">Medicine Orders</h1>
                <p className="header-subtitle">Manage and track all medicine orders</p>
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
              <p className="stat-label">Total Orders</p>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="stat-icon purple">
              <FiShoppingBag size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Pending</p>
              <p className="stat-value">{stats.placed}</p>
            </div>
            <div className="stat-icon yellow">
              <FiClock size={20} />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Delivered</p>
              <p className="stat-value">{stats.delivered}</p>
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

        {/* Revenue Breakdown */}
        <div className="revenue-breakdown">
          <div className="revenue-card">
            <div className="revenue-icon cod">💰</div>
            <div className="revenue-info">
              <p className="revenue-label">COD Orders</p>
              <p className="revenue-amount">₹{stats.codAmount.toLocaleString()}</p>
            </div>
          </div>
          <div className="revenue-card">
            <div className="revenue-icon online">💳</div>
            <div className="revenue-info">
              <p className="revenue-label">Online Payments</p>
              <p className="revenue-amount">₹{stats.onlineAmount.toLocaleString()}</p>
            </div>
          </div>
          <div className="revenue-card">
            <div className="revenue-icon wallet">👛</div>
            <div className="revenue-info">
              <p className="revenue-label">Wallet Payments</p>
              <p className="revenue-amount">₹{stats.walletAmount.toLocaleString()}</p>
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
                placeholder="Search by Order ID, Medicine Name, or User..."
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
                <option value="PLACED">Placed</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              
              <select 
                value={paymentFilter} 
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Payment Status</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="FAILED">Failed</option>
              </select>
              
              <select 
                value={paymentMethodFilter} 
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Payment Methods</option>
                <option value="COD">Cash on Delivery</option>
                <option value="ONLINE">Online Payment</option>
                <option value="WALLET">Wallet</option>
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
                  setPaymentMethodFilter('ALL');
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
            <p>Loading orders...</p>
          </div>
        )}

        {/* Orders Table */}
        {!loading && (
          <>
            {filteredOrders.length > 0 ? (
              <div className="orders-table-container">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((order) => {
                      const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                      return (
                        <tr key={order._id}>
                          <td className="order-id">
                            <code>#{order._id?.slice(-8)}</code>
                          </td>
                          <td>
                            <div className="items-info">
                              <div className="items-icon">
                                <FaPills size={16} />
                              </div>
                              <div>
                                <div className="items-count">{totalItems} items</div>
                                <button 
                                  onClick={() => handleViewDetails(order)}
                                  className="view-items-btn"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="total-amount">₹{order.totalAmount?.toLocaleString()}</td>
                          <td>
                            <div className="payment-info">
                              <span className={`payment-status ${getPaymentStatusColor(order.paymentStatus)}`}>
                                {order.paymentStatus}
                              </span>
                              <div className="payment-method">
                                {getPaymentMethodIcon(order.paymentMethod)} {order.paymentMethod}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="status-dropdown">
                              <select
                                value={order.orderStatus}
                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                className={`status-select ${getStatusColor(order.orderStatus)}`}
                              >
                                <option value="PLACED">Placed</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>
                            </div>
                          </td>
                          <td>
                            <div className="date-info">
                              <FiCalendar size={12} />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                onClick={() => handleViewDetails(order)} 
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaPills size={48} />
                </div>
                <h3>No orders found</h3>
                <p>No medicine orders match your search criteria.</p>
              </div>
            )}

            {/* Pagination */}
            {filteredOrders.length > itemsPerPage && (
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

        {/* Order Details Modal */}
        {isDetailModalOpen && selectedOrder && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsDetailModalOpen(false); }}>
            <div className="modal-content detail-modal">
              <div className="modal-header">
                <div className="modal-header-icon">
                  <FaPills size={20} />
                </div>
                <h2>Order Details</h2>
                <button onClick={() => setIsDetailModalOpen(false)} className="modal-close">
                  <FiX size={22} />
                </button>
              </div>
              
              <div className="detail-body">
                {/* Order Info */}
                <div className="detail-section">
                  <h3 className="section-title">
                    <FiShoppingBag size={16} />
                    Order Information
                  </h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Order ID</span>
                      <span className="detail-value"><code>{selectedOrder._id}</code></span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Order Date</span>
                      <span className="detail-value">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Order Status</span>
                      <span className={`detail-value status-badge ${getStatusColor(selectedOrder.orderStatus)}`}>
                        {getStatusIcon(selectedOrder.orderStatus)} {selectedOrder.orderStatus}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total Amount</span>
                      <span className="detail-value price">₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="detail-section">
                  <h3 className="section-title">
                    <FiUser size={16} />
                    Customer Information
                  </h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Name</span>
                      <span className="detail-value">{selectedOrder.user?.name || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{selectedOrder.user?.email || 'N/A'}</span>
                    </div>
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
                      <span className="detail-value">
                        {getPaymentMethodIcon(selectedOrder.paymentMethod)} {selectedOrder.paymentMethod}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Payment Status</span>
                      <span className={`detail-value ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                    {selectedOrder.paidAt && (
                      <div className="detail-item">
                        <span className="detail-label">Paid At</span>
                        <span className="detail-value">{new Date(selectedOrder.paidAt).toLocaleString()}</span>
                      </div>
                    )}
                    {selectedOrder.razorpayPaymentId && (
                      <div className="detail-item">
                        <span className="detail-label">Payment ID</span>
                        <span className="detail-value"><code>{selectedOrder.razorpayPaymentId}</code></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="detail-section">
                  <h3 className="section-title">
                    <FiMapPin size={16} />
                    Delivery Address
                  </h3>
                  <div className="address-box">
                    {selectedOrder.deliveryAddress}
                  </div>
                </div>

                {/* Order Items */}
                <div className="detail-section">
                  <h3 className="section-title">
                    <FaPills size={16} />
                    Order Items
                  </h3>
                  <div className="items-list">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="order-item">
                        {item.image && <img src={item.image} alt={item.name} className="item-image" />}
                        <div className="item-details">
                          <div className="item-name">{item.name}</div>
                          <div className="item-price">
                            ₹{item.price} × {item.quantity} = ₹{item.totalPrice}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="detail-section">
                  <h3 className="section-title">
                    <FiClock size={16} />
                    Order Timeline
                  </h3>
                  <div className="timeline">
                    <div className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-title">Order Placed</div>
                        <div className="timeline-date">{new Date(selectedOrder.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    {selectedOrder.paidAt && (
                      <div className="timeline-item">
                        <div className="timeline-dot paid"></div>
                        <div className="timeline-content">
                          <div className="timeline-title">Payment Completed</div>
                          <div className="timeline-date">{new Date(selectedOrder.paidAt).toLocaleString()}</div>
                        </div>
                      </div>
                    )}
                    {selectedOrder.deliveredAt && (
                      <div className="timeline-item">
                        <div className="timeline-dot delivered"></div>
                        <div className="timeline-content">
                          <div className="timeline-title">Order Delivered</div>
                          <div className="timeline-date">{new Date(selectedOrder.deliveredAt).toLocaleString()}</div>
                        </div>
                      </div>
                    )}
                  </div>
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

        .medicine-orders-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%);
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
          background: linear-gradient(135deg, #10b981, #059669);
          padding: 14px;
          border-radius: 20px;
          box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3);
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
          color: #10b981;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
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

        .revenue-breakdown {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 28px;
        }

        .revenue-card {
          background: white;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid #e2e8f0;
        }

        .revenue-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .revenue-icon.cod { background: #fef3c7; }
        .revenue-icon.online { background: #dbeafe; }
        .revenue-icon.wallet { background: #e0e7ff; }

        .revenue-label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .revenue-amount {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
        }

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
          border-color: #10b981;
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

        .orders-table-container {
          background: white;
          border-radius: 24px;
          overflow: auto;
          border: 1px solid #e2e8f0;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
        }

        .orders-table th {
          text-align: left;
          padding: 16px 20px;
          background: #f8fafc;
          font-weight: 600;
          font-size: 13px;
          color: #475569;
          border-bottom: 1px solid #e2e8f0;
        }

        .orders-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        .orders-table tr:hover {
          background: #f0fdf4;
        }

        .order-id code {
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
        }

        .items-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .items-icon {
          width: 36px;
          height: 36px;
          background: #dcfce7;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #10b981;
        }

        .items-count {
          font-weight: 500;
          font-size: 14px;
        }

        .view-items-btn {
          font-size: 11px;
          color: #10b981;
          background: none;
          border: none;
          cursor: pointer;
        }

        .total-amount {
          font-weight: 600;
          color: #10b981;
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
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .status-select {
          padding: 6px 10px;
          border: none;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }

        .date-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #64748b;
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
          color: #10b981;
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
          background: #dcfce7;
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: #10b981;
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
          background: #10b981;
          border-color: #10b981;
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
          background: linear-gradient(135deg, #10b981, #059669);
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
          border-bottom: 2px solid #dcfce7;
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
          font-size: 18px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 8px;
        }

        .address-box {
          background: #f8fafc;
          padding: 12px;
          border-radius: 12px;
          line-height: 1.5;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .order-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .item-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 10px;
        }

        .item-details {
          flex: 1;
        }

        .item-name {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .item-price {
          font-size: 14px;
          color: #10b981;
          font-weight: 500;
        }

        .timeline {
          position: relative;
          padding-left: 20px;
        }

        .timeline-item {
          display: flex;
          gap: 16px;
          padding-bottom: 20px;
          position: relative;
        }

        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #cbd5e1;
          margin-top: 4px;
          position: relative;
        }

        .timeline-dot::before {
          content: '';
          position: absolute;
          left: 5px;
          top: 12px;
          width: 2px;
          height: 40px;
          background: #e2e8f0;
        }

        .timeline-item:last-child .timeline-dot::before {
          display: none;
        }

        .timeline-dot.paid { background: #10b981; }
        .timeline-dot.delivered { background: #8b5cf6; }

        .timeline-title {
          font-weight: 600;
          font-size: 14px;
          color: #1e293b;
        }

        .timeline-date {
          font-size: 12px;
          color: #64748b;
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
          
          .orders-table th, .orders-table td {
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

export default MedicineOrders;