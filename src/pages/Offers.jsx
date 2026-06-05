// // src/pages/Offers.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast, Toaster } from 'react-hot-toast';
// import { 
//   FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiLoader, 
//   FiChevronLeft, FiChevronRight, FiRefreshCw, FiDownload,
//   FiFilter, FiEye, FiTag, FiDollarSign, FiCheckCircle,
//   FiXCircle, FiClock, FiPercent, FiUser, FiGrid, FiList
// } from 'react-icons/fi';
// import { FaHeartbeat, FaTooth, FaEye, FaBrain, FaBone, FaStethoscope, FaUserMd } from 'react-icons/fa';

// const API_URL = 'https://userside-x164.onrender.com/api/offers';

// const Offers = () => {
//   const [offers, setOffers] = useState([]);
//   const [filteredOffers, setFilteredOffers] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [editingOffer, setEditingOffer] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [selectedOffer, setSelectedOffer] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('ALL');
//   const [specialtyFilter, setSpecialtyFilter] = useState('ALL');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(9);
//   const [viewMode, setViewMode] = useState('grid');
//   const [error, setError] = useState('');
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     inactive: 0,
//     avgDiscount: 0
//   });

//   // Form state
//   const [formData, setFormData] = useState({
//     title: '',
//     tagline: '',
//     desc: '',
//     discount: '',
//     specialty: 'General Physician',
//     doctorId: '',
//     isActive: true
//   });

//   const specialtyOptions = [
//     { value: 'Dental', label: 'Dental', icon: <FaTooth /> },
//     { value: 'Eye Care', label: 'Eye Care', icon: <FaEye /> },
//     { value: 'Cardiology', label: 'Cardiology', icon: <FaHeartbeat /> },
//     { value: 'Neurology', label: 'Neurology', icon: <FaBrain /> },
//     { value: 'Orthopedic', label: 'Orthopedic', icon: <FaBone /> },
//     { value: 'General Physician', label: 'General Physician', icon: <FaStethoscope /> }
//   ];

//   // Fetch data
//   useEffect(() => {
//     fetchOffers();
//     fetchDoctors();
//   }, []);

//   // Filter offers
//   useEffect(() => {
//     let result = [...offers];
    
//     if (searchTerm.trim() !== '') {
//       result = result.filter(offer =>
//         offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         offer.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         offer.desc?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     if (statusFilter !== 'ALL') {
//       result = result.filter(offer => offer.isActive === (statusFilter === 'ACTIVE'));
//     }
    
//     if (specialtyFilter !== 'ALL') {
//       result = result.filter(offer => offer.specialty === specialtyFilter);
//     }
    
//     result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//     setFilteredOffers(result);
//     setCurrentPage(1);
//   }, [searchTerm, offers, statusFilter, specialtyFilter]);

//   const fetchOffers = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(API_URL);
      
//       if (response.data.success) {
//         setOffers(response.data.data || []);
//         calculateStats(response.data.data || []);
//       } else {
//         toast.error(response.data.message || 'Failed to fetch offers');
//       }
//     } catch (error) {
//       console.error('Error fetching offers:', error);
//       toast.error(error.response?.data?.message || 'Failed to fetch offers');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDoctors = async () => {
//     try {
//       const token = localStorage.getItem('adminToken');
//       const response = await axios.get('https://userside-x164.onrender.com/api/doctors/all', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         setDoctors(response.data.data || []);
//       }
//     } catch (error) {
//       console.error('Error fetching doctors:', error);
//     }
//   };

//   const calculateStats = (offersData) => {
//     const total = offersData.length;
//     const active = offersData.filter(o => o.isActive).length;
//     const inactive = total - active;
//     const totalDiscount = offersData.reduce((sum, o) => {
//       const discount = parseInt(o.discount) || 0;
//       return sum + discount;
//     }, 0);
//     const avgDiscount = total > 0 ? totalDiscount / total : 0;
    
//     setStats({ total, active, inactive, avgDiscount });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
//     if (!validTypes.includes(file.type)) {
//       toast.error('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
//       return;
//     }
    
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error('Image size should be less than 5MB');
//       return;
//     }
    
//     setImageFile(file);
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       setImagePreview(e.target.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     if (!formData.title) {
//       setError('Offer title is required');
//       return;
//     }
//     if (!formData.specialty) {
//       setError('Please select a specialty');
//       return;
//     }

//     setSubmitting(true);
//     setUploadProgress(0);

//     try {
//       const submitData = new FormData();
//       submitData.append('title', formData.title.trim());
//       submitData.append('tagline', formData.tagline);
//       submitData.append('desc', formData.desc);
//       submitData.append('discount', formData.discount);
//       submitData.append('specialty', formData.specialty);
//       submitData.append('doctorId', formData.doctorId);
//       submitData.append('isActive', formData.isActive);
      
//       if (imageFile) {
//         submitData.append('image', imageFile);
//       }

//       let response;
//       if (editingOffer) {
//         response = await axios.put(`${API_URL}/${editingOffer._id}`, submitData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           onUploadProgress: (progressEvent) => {
//             if (progressEvent.total) {
//               const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//               setUploadProgress(percentCompleted);
//             }
//           }
//         });
//         if (response.data.success) {
//           toast.success('Offer updated successfully');
//         }
//       } else {
//         response = await axios.post(API_URL, submitData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           onUploadProgress: (progressEvent) => {
//             if (progressEvent.total) {
//               const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//               setUploadProgress(percentCompleted);
//             }
//           }
//         });
//         if (response.data.success) {
//           toast.success('Offer created successfully');
//         }
//       }
      
//       setIsModalOpen(false);
//       resetForm();
//       fetchOffers();
//     } catch (error) {
//       console.error('Error saving offer:', error);
//       setError(error.response?.data?.message || 'Operation failed');
//     } finally {
//       setSubmitting(false);
//       setUploadProgress(0);
//     }
//   };

//   const handleDeleteClick = (offer) => {
//     setDeleteTarget(offer);
//     setIsDeleteModalOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!deleteTarget) return;
//     try {
//       const response = await axios.delete(`${API_URL}/${deleteTarget._id}`);
//       if (response.data.success) {
//         toast.success('Offer deleted successfully');
//         setIsDeleteModalOpen(false);
//         setDeleteTarget(null);
//         fetchOffers();
//       }
//     } catch (error) {
//       console.error('Error deleting offer:', error);
//       toast.error(error.response?.data?.message || 'Failed to delete offer');
//     }
//   };

//   const handleViewDetails = (offer) => {
//     setSelectedOffer(offer);
//     setIsDetailModalOpen(true);
//   };

//   const resetForm = () => {
//     setEditingOffer(null);
//     setFormData({
//       title: '',
//       tagline: '',
//       desc: '',
//       discount: '',
//       specialty: 'General Physician',
//       doctorId: '',
//       isActive: true
//     });
//     setImageFile(null);
//     setImagePreview(null);
//     setError('');
//   };

//   const handleEdit = (offer) => {
//     setEditingOffer(offer);
//     setFormData({
//       title: offer.title,
//       tagline: offer.tagline || '',
//       desc: offer.desc || '',
//       discount: offer.discount || '',
//       specialty: offer.specialty || 'General Physician',
//       doctorId: offer.doctorId?._id || offer.doctorId || '',
//       isActive: offer.isActive
//     });
//     setImagePreview(offer.image?.url);
//     setImageFile(null);
//     setIsModalOpen(true);
//   };

//   const handleRefresh = () => {
//     fetchOffers();
//     toast.success('Refreshed successfully');
//   };

//   const handleExport = () => {
//     const exportData = filteredOffers.map(offer => ({
//       'ID': offer._id,
//       'Title': offer.title,
//       'Tagline': offer.tagline,
//       'Description': offer.desc,
//       'Discount': offer.discount,
//       'Specialty': offer.specialty,
//       'Doctor': offer.doctorId?.name || 'N/A',
//       'Status': offer.isActive ? 'Active' : 'Inactive',
//       'Created At': new Date(offer.createdAt).toLocaleString()
//     }));
    
//     const dataStr = JSON.stringify(exportData, null, 2);
//     const blob = new Blob([dataStr], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `offers-${new Date().toISOString()}.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//     toast.success('Exported successfully');
//   };

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredOffers.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);

//   const getSpecialtyIcon = (specialty) => {
//     const icons = {
//       'Dental': <FaTooth />,
//       'Eye Care': <FaEye />,
//       'Cardiology': <FaHeartbeat />,
//       'Neurology': <FaBrain />,
//       'Orthopedic': <FaBone />,
//       'General Physician': <FaStethoscope />
//     };
//     return icons[specialty] || <FaStethoscope />;
//   };

//   return (
//     <div className="offers-container">
//       <Toaster 
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: '#1e293b',
//             color: '#fff',
//             borderRadius: '12px',
//             padding: '16px',
//           },
//         }}
//       />
      
//       <div className="content-wrapper">
//         {/* Header Section */}
//         <div className="header-section">
//           <div className="header-top">
//             <div className="header-title-group">
//               <div className="header-icon">
//                 <FiPercent size={28} />
//               </div>
//               <div>
//                 <h1 className="header-title">Offers & Discounts</h1>
//                 <p className="header-subtitle">Manage promotional offers and discount campaigns</p>
//               </div>
//             </div>
            
//             <div className="header-actions">
//               <button onClick={handleRefresh} className="action-btn" title="Refresh">
//                 <FiRefreshCw size={18} />
//               </button>
//               <button onClick={handleExport} className="action-btn" title="Export">
//                 <FiDownload size={18} />
//               </button>
//               <div className="view-toggle">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
//                 >
//                   <FiGrid size={16} />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
//                 >
//                   <FiList size={16} />
//                 </button>
//               </div>
//               <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="create-btn">
//                 <FiPlus size={18} />
//                 Add Offer
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="stats-grid">
//           <div className="stat-card">
//             <div className="stat-info">
//               <p className="stat-label">Total Offers</p>
//               <p className="stat-value">{stats.total}</p>
//             </div>
//             <div className="stat-icon purple">
//               <FiTag size={20} />
//             </div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-info">
//               <p className="stat-label">Active Offers</p>
//               <p className="stat-value">{stats.active}</p>
//             </div>
//             <div className="stat-icon green">
//               <FiCheckCircle size={20} />
//             </div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-info">
//               <p className="stat-label">Inactive</p>
//               <p className="stat-value">{stats.inactive}</p>
//             </div>
//             <div className="stat-icon red">
//               <FiXCircle size={20} />
//             </div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-info">
//               <p className="stat-label">Avg Discount</p>
//               <p className="stat-value">{stats.avgDiscount.toFixed(0)}%</p>
//             </div>
//             <div className="stat-icon orange">
//               <FiPercent size={20} />
//             </div>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="search-filters-card">
//           <div className="search-wrapper">
//             <FiSearch className="search-icon" size={18} />
//             <input
//               type="text"
//               placeholder="Search offers by title..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="search-input"
//             />
//             {searchTerm && (
//               <button onClick={() => setSearchTerm('')} className="clear-search">
//                 <FiX size={16} />
//               </button>
//             )}
//           </div>
          
//           <div className="filter-row">
//             <select 
//               value={statusFilter} 
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="filter-select"
//             >
//               <option value="ALL">All Status</option>
//               <option value="ACTIVE">Active</option>
//               <option value="INACTIVE">Inactive</option>
//             </select>
            
//             <select 
//               value={specialtyFilter} 
//               onChange={(e) => setSpecialtyFilter(e.target.value)}
//               className="filter-select"
//             >
//               <option value="ALL">All Specialties</option>
//               {specialtyOptions.map(opt => (
//                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="loading-state">
//             <FiLoader className="spinner" size={48} />
//             <p>Loading offers...</p>
//           </div>
//         )}

//         {/* Offers Grid/List */}
//         {!loading && (
//           <>
//             {filteredOffers.length > 0 ? (
//               viewMode === 'grid' ? (
//                 <div className="offers-grid">
//                   {currentItems.map((offer) => (
//                     <div key={offer._id} className="offer-card">
//                       <div className="card-image">
//                         {offer.image?.url ? (
//                           <img src={offer.image.url} alt={offer.title} />
//                         ) : (
//                           <div className="image-placeholder">
//                             <FiPercent size={48} />
//                           </div>
//                         )}
//                         <div className="discount-badge">
//                           {offer.discount}% OFF
//                         </div>
//                         <div className={`status-badge ${offer.isActive ? 'active' : 'inactive'}`}>
//                           {offer.isActive ? 'Active' : 'Inactive'}
//                         </div>
//                       </div>
                      
//                       <div className="card-content">
//                         <div className="specialty-icon">
//                           {getSpecialtyIcon(offer.specialty)}
//                           <span>{offer.specialty}</span>
//                         </div>
                        
//                         <h3 className="offer-title">{offer.title}</h3>
//                         <p className="offer-tagline">{offer.tagline}</p>
                        
//                         {offer.doctorId && (
//                           <div className="doctor-info">
//                             <FiUser size={14} />
//                             <span>Dr. {offer.doctorId.name}</span>
//                           </div>
//                         )}
                        
//                         <p className="offer-description">{offer.desc?.substring(0, 80)}...</p>
//                       </div>
                      
//                       <div className="card-actions">
//                         <button onClick={() => handleViewDetails(offer)} className="view-btn">
//                           <FiEye size={14} />
//                           View
//                         </button>
//                         <button onClick={() => handleEdit(offer)} className="edit-btn">
//                           <FiEdit2 size={14} />
//                           Edit
//                         </button>
//                         <button onClick={() => handleDeleteClick(offer)} className="delete-btn">
//                           <FiTrash2 size={14} />
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="offers-list-view">
//                   <table className="list-table">
//                     <thead>
//                       <tr>
//                         <th>Image</th>
//                         <th>Title</th>
//                         <th>Discount</th>
//                         <th>Specialty</th>
//                         <th>Doctor</th>
//                         <th>Status</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {currentItems.map((offer) => (
//                         <tr key={offer._id}>
//                           <td className="list-image">
//                             {offer.image?.url ? (
//                               <img src={offer.image.url} alt={offer.title} />
//                             ) : (
//                               <div className="list-image-placeholder">
//                                 <FiPercent size={20} />
//                               </div>
//                             )}
//                            </td>
//                           <td>
//                             <div className="list-title">{offer.title}</div>
//                             <div className="list-tagline">{offer.tagline}</div>
//                            </td>
//                           <td className="discount">{offer.discount}%</td>
//                           <td>
//                             <div className="specialty-badge">
//                               {getSpecialtyIcon(offer.specialty)} {offer.specialty}
//                             </div>
//                            </td>
//                           <td>{offer.doctorId?.name || '—'}</td>
//                           <td>
//                             <span className={`status-badge-small ${offer.isActive ? 'active' : 'inactive'}`}>
//                               {offer.isActive ? 'Active' : 'Inactive'}
//                             </span>
//                            </td>
//                           <td>
//                             <div className="action-buttons">
//                               <button onClick={() => handleViewDetails(offer)} className="icon-btn view" title="View">
//                                 <FiEye size={16} />
//                               </button>
//                               <button onClick={() => handleEdit(offer)} className="icon-btn edit" title="Edit">
//                                 <FiEdit2 size={16} />
//                               </button>
//                               <button onClick={() => handleDeleteClick(offer)} className="icon-btn delete" title="Delete">
//                                 <FiTrash2 size={16} />
//                               </button>
//                             </div>
//                            </td>
//                          </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )
//             ) : (
//               <div className="empty-state">
//                 <div className="empty-icon">
//                   <FiPercent size={48} />
//                 </div>
//                 <h3>{searchTerm ? 'No results found' : 'No offers yet'}</h3>
//                 <p>
//                   {searchTerm 
//                     ? `No offers match "${searchTerm}". Try a different search term.`
//                     : 'Create your first offer to start promoting discounts.'}
//                 </p>
//                 {!searchTerm && (
//                   <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="create-empty-btn">
//                     <FiPlus size={18} />
//                     Create First Offer
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* Pagination */}
//             {filteredOffers.length > itemsPerPage && (
//               <div className="pagination">
//                 <button
//                   onClick={() => paginate(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="page-nav"
//                 >
//                   <FiChevronLeft size={18} />
//                 </button>
//                 <div className="page-numbers">
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
//                     <button
//                       key={number}
//                       onClick={() => paginate(number)}
//                       className={`page-number ${currentPage === number ? 'active' : ''}`}
//                     >
//                       {number}
//                     </button>
//                   ))}
//                 </div>
//                 <button
//                   onClick={() => paginate(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="page-nav"
//                 >
//                   <FiChevronRight size={18} />
//                 </button>
//               </div>
//             )}
//           </>
//         )}

//         {/* Create/Edit Modal */}
//         {isModalOpen && (
//           <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setIsModalOpen(false); resetForm(); } }}>
//             <div className="modal-content large-modal">
//               <div className="modal-header">
//                 <div className="modal-header-icon">
//                   <FiPercent size={20} />
//                 </div>
//                 <h2>{editingOffer ? 'Edit Offer' : 'Create Offer'}</h2>
//                 <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="modal-close">
//                   <FiX size={22} />
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} className="modal-form">
//                 {error && <div className="error-box">{error}</div>}
                
//                 <div className="form-grid">
//                   <div className="form-group full-width">
//                     <label>Offer Title <span className="required">*</span></label>
//                     <input
//                       type="text"
//                       value={formData.title}
//                       onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//                       placeholder="e.g., Summer Special, Health Checkup Camp"
//                     />
//                   </div>
                  
//                   <div className="form-group full-width">
//                     <label>Tagline</label>
//                     <input
//                       type="text"
//                       value={formData.tagline}
//                       onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
//                       placeholder="Short catchy phrase"
//                     />
//                   </div>
                  
//                   <div className="form-group full-width">
//                     <label>Description</label>
//                     <textarea
//                       value={formData.desc}
//                       onChange={(e) => setFormData(prev => ({ ...prev, desc: e.target.value }))}
//                       placeholder="Detailed description of the offer"
//                       rows="3"
//                     />
//                   </div>
                  
//                   <div className="form-group">
//                     <label>Discount (%)</label>
//                     <input
//                       type="text"
//                       value={formData.discount}
//                       onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
//                       placeholder="e.g., 20, 30, 50"
//                     />
//                   </div>
                  
//                   <div className="form-group">
//                     <label>Specialty <span className="required">*</span></label>
//                     <select
//                       value={formData.specialty}
//                       onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
//                     >
//                       {specialtyOptions.map(opt => (
//                         <option key={opt.value} value={opt.value}>{opt.label}</option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div className="form-group">
//                     <label>Doctor (Optional)</label>
//                     <select
//                       value={formData.doctorId}
//                       onChange={(e) => setFormData(prev => ({ ...prev, doctorId: e.target.value }))}
//                     >
//                       <option value="">Select Doctor</option>
//                       {doctors.map(doc => (
//                         <option key={doc._id} value={doc._id}>Dr. {doc.name} - {doc.specialization}</option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div className="form-group">
//                     <label>Status</label>
//                     <select
//                       value={formData.isActive}
//                       onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
//                     >
//                       <option value="true">Active</option>
//                       <option value="false">Inactive</option>
//                     </select>
//                   </div>
                  
//                   <div className="form-group full-width">
//                     <label>Offer Image</label>
//                     <div className="image-upload-area">
//                       {imagePreview ? (
//                         <div className="image-preview-container">
//                           <img src={imagePreview} alt="Preview" className="image-preview" />
//                           <button
//                             type="button"
//                             className="remove-image-btn"
//                             onClick={() => {
//                               setImageFile(null);
//                               setImagePreview(null);
//                             }}
//                           >
//                             Remove Image
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="upload-placeholder" onClick={() => document.getElementById('imageInput').click()}>
//                           <FiPlus size={32} />
//                           <p>Click to upload image</p>
//                           <small>PNG, JPG, GIF up to 5MB</small>
//                         </div>
//                       )}
//                       <input
//                         id="imageInput"
//                         type="file"
//                         accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
//                         style={{ display: 'none' }}
//                         onChange={handleImageChange}
//                       />
//                     </div>
//                     {uploadProgress > 0 && uploadProgress < 100 && (
//                       <div className="upload-progress">
//                         <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="form-actions">
//                   <button type="submit" disabled={submitting} className="submit-btn">
//                     {submitting ? <FiLoader className="spinner-small" size={20} /> : (editingOffer ? 'Update Offer' : 'Create Offer')}
//                   </button>
//                   <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="cancel-btn">
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Delete Confirmation Modal */}
//         {isDeleteModalOpen && (
//           <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setIsDeleteModalOpen(false); setDeleteTarget(null); } }}>
//             <div className="modal-content delete-modal">
//               <div className="delete-icon-wrapper">
//                 <FiTrash2 size={40} />
//               </div>
//               <h3>Delete Offer</h3>
//               <p>
//                 Are you sure you want to delete <strong>"{deleteTarget?.title}"</strong>? This action cannot be undone.
//               </p>
//               <div className="delete-actions">
//                 <button onClick={handleDeleteConfirm} className="confirm-delete-btn">
//                   Delete
//                 </button>
//                 <button onClick={() => { setIsDeleteModalOpen(false); setDeleteTarget(null); }} className="cancel-delete-btn">
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Details Modal */}
//         {isDetailModalOpen && selectedOffer && (
//           <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsDetailModalOpen(false); }}>
//             <div className="modal-content detail-modal">
//               <div className="modal-header">
//                 <div className="modal-header-icon">
//                   <FiPercent size={20} />
//                 </div>
//                 <h2>Offer Details</h2>
//                 <button onClick={() => setIsDetailModalOpen(false)} className="modal-close">
//                   <FiX size={22} />
//                 </button>
//               </div>
              
//               <div className="detail-body">
//                 {selectedOffer.image?.url && (
//                   <div className="detail-image">
//                     <img src={selectedOffer.image.url} alt={selectedOffer.title} />
//                   </div>
//                 )}
                
//                 <div className="detail-item">
//                   <span className="detail-label">Title</span>
//                   <span className="detail-value">{selectedOffer.title}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="detail-label">Tagline</span>
//                   <span className="detail-value">{selectedOffer.tagline || '—'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="detail-label">Description</span>
//                   <span className="detail-value">{selectedOffer.desc || '—'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="detail-label">Discount</span>
//                   <span className="detail-value discount">{selectedOffer.discount}% OFF</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="detail-label">Specialty</span>
//                   <span className="detail-value">
//                     {getSpecialtyIcon(selectedOffer.specialty)} {selectedOffer.specialty}
//                   </span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="detail-label">Doctor</span>
//                   <span className="detail-value">{selectedOffer.doctorId?.name ? `Dr. ${selectedOffer.doctorId.name}` : 'Not assigned'}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="detail-label">Status</span>
//                   <span className={`detail-value status ${selectedOffer.isActive ? 'active' : 'inactive'}`}>
//                     {selectedOffer.isActive ? 'Active' : 'Inactive'}
//                   </span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="detail-label">Created At</span>
//                   <span className="detail-value">{new Date(selectedOffer.createdAt).toLocaleString()}</span>
//                 </div>
//                 <div className="detail-item">
//                   <span className="detail-label">Last Updated</span>
//                   <span className="detail-value">{new Date(selectedOffer.updatedAt).toLocaleString()}</span>
//                 </div>
//               </div>
              
//               <div className="detail-actions">
//                 <button onClick={() => { setIsDetailModalOpen(false); handleEdit(selectedOffer); }} className="detail-edit-btn">
//                   <FiEdit2 size={16} />
//                   Edit Offer
//                 </button>
//                 <button onClick={() => setIsDetailModalOpen(false)} className="detail-close-btn">
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <style>{`
//         .offers-container {
//           min-height: 100vh;
//           background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%);
//           font-family: 'Inter', system-ui, sans-serif;
//         }

//         .content-wrapper {
//           max-width: 1400px;
//           margin: 0 auto;
//           padding: 32px 24px;
//         }

//         .header-section { margin-bottom: 32px; }
//         .header-top { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
//         .header-title-group { display: flex; align-items: center; gap: 16px; }
//         .header-icon { background: linear-gradient(135deg, #10b981, #059669); padding: 14px; border-radius: 20px; }
//         .header-icon svg { color: white; }
//         .header-title { font-size: 28px; font-weight: 700; color: #1e293b; }
//         .header-subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
//         .header-actions { display: flex; gap: 12px; align-items: center; }
//         .action-btn { padding: 10px; background: white; border: 1px solid #e2e8f0; border-radius: 14px; cursor: pointer; }
//         .view-toggle { display: flex; gap: 4px; background: #f1f5f9; padding: 4px; border-radius: 14px; }
//         .view-btn { padding: 8px 12px; background: transparent; border: none; border-radius: 10px; cursor: pointer; }
//         .view-btn.active { background: white; color: #10b981; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
//         .create-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: 14px; color: white; font-weight: 600; cursor: pointer; }

//         .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 28px; }
//         .stat-card { background: white; border-radius: 20px; padding: 20px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; }
//         .stat-label { font-size: 13px; color: #64748b; margin-bottom: 6px; }
//         .stat-value { font-size: 28px; font-weight: 700; color: #1e293b; }
//         .stat-icon { width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
//         .stat-icon.purple { background: #eef2ff; color: #8b5cf6; }
//         .stat-icon.green { background: #ecfdf5; color: #10b981; }
//         .stat-icon.red { background: #fef2f2; color: #ef4444; }
//         .stat-icon.orange { background: #fff7ed; color: #f97316; }

//         .search-filters-card { background: white; border-radius: 24px; padding: 20px; margin-bottom: 28px; border: 1px solid #e2e8f0; display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
//         .search-wrapper { flex: 2; position: relative; }
//         .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
//         .search-input { width: 100%; padding: 12px 40px; border: 1px solid #e2e8f0; border-radius: 14px; }
//         .search-input:focus { outline: none; border-color: #10b981; }
//         .clear-search { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; }
//         .filter-row { display: flex; gap: 12px; flex: 1; }
//         .filter-select { padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 12px; background: white; flex: 1; }

//         .offers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 24px; margin-bottom: 32px; }
//         .offer-card { background: white; border-radius: 24px; overflow: hidden; transition: all 0.3s; border: 1px solid #e2e8f0; }
//         .offer-card:hover { transform: translateY(-4px); box-shadow: 0 20px 25px -12px rgba(0,0,0,0.15); }

//         .card-image { height: 200px; position: relative; overflow: hidden; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; }
//         .card-image img { width: 100%; height: 100%; object-fit: cover; }
//         .image-placeholder { display: flex; align-items: center; justify-content: center; height: 100%; width: 100%; color: rgba(255,255,255,0.7); }
//         .discount-badge { position: absolute; top: 16px; left: 16px; background: #ef4444; color: white; padding: 6px 14px; border-radius: 20px; font-size: 14px; font-weight: 700; }
//         .status-badge { position: absolute; top: 16px; right: 16px; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; }
//         .status-badge.active { background: #10b981; color: white; }
//         .status-badge.inactive { background: #ef4444; color: white; }

//         .card-content { padding: 20px; }
//         .specialty-icon { display: inline-flex; align-items: center; gap: 6px; background: #ecfdf5; color: #10b981; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 12px; }
//         .offer-title { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 8px; }
//         .offer-tagline { font-size: 13px; color: #64748b; margin-bottom: 12px; }
//         .doctor-info { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #475569; margin-bottom: 12px; }
//         .offer-description { font-size: 13px; color: #64748b; line-height: 1.5; }

//         .card-actions { display: flex; gap: 12px; padding: 16px 20px; border-top: 1px solid #e2e8f0; }
//         .view-btn, .edit-btn, .delete-btn { flex: 1; padding: 8px; border: none; border-radius: 10px; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
//         .view-btn { background: #ecfdf5; color: #10b981; }
//         .edit-btn { background: #fef3c7; color: #d97706; }
//         .delete-btn { background: #fee2e2; color: #dc2626; }

//         .offers-list-view { background: white; border-radius: 24px; overflow: auto; border: 1px solid #e2e8f0; }
//         .list-table { width: 100%; border-collapse: collapse; }
//         .list-table th { text-align: left; padding: 16px 20px; background: #f8fafc; font-weight: 600; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
//         .list-table td { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
//         .list-table tr:hover { background: #f0fdf4; }
//         .list-image img { width: 50px; height: 50px; object-fit: cover; border-radius: 12px; }
//         .list-image-placeholder { width: 50px; height: 50px; background: #ecfdf5; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #10b981; }
//         .list-title { font-weight: 600; margin-bottom: 4px; }
//         .list-tagline { font-size: 12px; color: #64748b; }
//         .discount { font-weight: 700; color: #10b981; font-size: 16px; }
//         .specialty-badge { display: inline-flex; align-items: center; gap: 6px; background: #ecfdf5; padding: 4px 10px; border-radius: 8px; font-size: 12px; color: #10b981; }
//         .status-badge-small { padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: 500; }
//         .status-badge-small.active { background: #dcfce7; color: #166534; }
//         .status-badge-small.inactive { background: #fee2e2; color: #991b1b; }

//         .action-buttons { display: flex; gap: 8px; }
//         .icon-btn { padding: 6px; background: none; border: none; border-radius: 8px; cursor: pointer; }
//         .icon-btn.view { color: #3b82f6; }
//         .icon-btn.edit { color: #f59e0b; }
//         .icon-btn.delete { color: #ef4444; }

//         .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
//         .modal-content { background: white; border-radius: 32px; width: 90%; max-height: 90vh; overflow-y: auto; }
//         .large-modal { max-width: 700px; }
//         .detail-modal { max-width: 550px; }
//         .delete-modal { max-width: 400px; text-align: center; }

//         .modal-header { display: flex; align-items: center; gap: 12px; padding: 20px 24px; background: linear-gradient(135deg, #10b981, #059669); color: white; position: sticky; top: 0; }
//         .modal-header-icon { background: rgba(255,255,255,0.2); padding: 8px; border-radius: 12px; }
//         .modal-header h2 { flex: 1; font-size: 20px; margin: 0; }
//         .modal-close { background: rgba(255,255,255,0.2); border: none; border-radius: 10px; padding: 6px; cursor: pointer; color: white; }

//         .modal-form { padding: 24px; }
//         .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
//         .form-group.full-width { grid-column: span 2; }
//         .form-group label { display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; }
//         .required { color: #ef4444; }
//         .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 12px; font-family: inherit; }
//         .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #10b981; }

//         .image-upload-area { border: 2px dashed #e2e8f0; border-radius: 16px; padding: 20px; text-align: center; }
//         .image-preview-container { text-align: center; }
//         .image-preview { max-width: 200px; max-height: 200px; border-radius: 12px; margin-bottom: 12px; }
//         .remove-image-btn { background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; }
//         .upload-placeholder { cursor: pointer; padding: 20px; }
//         .upload-placeholder p { margin: 8px 0 4px; color: #64748b; }
//         .upload-placeholder small { color: #94a3b8; }
//         .upload-progress { margin-top: 12px; width: 100%; height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden; }
//         .upload-progress-bar { height: 100%; background: linear-gradient(135deg, #10b981, #059669); transition: width 0.3s; }

//         .form-actions { display: flex; gap: 12px; margin-top: 24px; }
//         .submit-btn { flex: 1; padding: 12px; background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: 14px; color: white; font-weight: 600; cursor: pointer; }
//         .cancel-btn { flex: 1; padding: 12px; background: white; border: 1px solid #e2e8f0; border-radius: 14px; cursor: pointer; }

//         .delete-icon-wrapper { width: 80px; height: 80px; background: #fee2e2; border-radius: 40px; display: flex; align-items: center; justify-content: center; margin: 24px auto 16px; color: #dc2626; }
//         .delete-actions { display: flex; gap: 12px; padding: 0 24px 24px; }
//         .confirm-delete-btn { flex: 1; padding: 12px; background: #dc2626; border: none; border-radius: 14px; color: white; cursor: pointer; }
//         .cancel-delete-btn { flex: 1; padding: 12px; background: white; border: 1px solid #e2e8f0; border-radius: 14px; cursor: pointer; }

//         .detail-body { padding: 24px; }
//         .detail-image { text-align: center; margin-bottom: 20px; }
//         .detail-image img { max-width: 200px; border-radius: 16px; }
//         .detail-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
//         .detail-label { color: #64748b; font-size: 13px; }
//         .detail-value { font-weight: 500; color: #1e293b; }
//         .detail-value.discount { color: #10b981; font-weight: 700; font-size: 18px; }
//         .detail-value.status.active { color: #10b981; }
//         .detail-value.status.inactive { color: #ef4444; }

//         .detail-actions { display: flex; gap: 12px; padding: 20px 24px; border-top: 1px solid #f1f5f9; }
//         .detail-edit-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: #10b981; color: white; border: none; border-radius: 14px; cursor: pointer; }
//         .detail-close-btn { flex: 1; padding: 12px; background: white; border: 1px solid #e2e8f0; border-radius: 14px; cursor: pointer; }

//         .loading-state { background: white; border-radius: 24px; padding: 80px; text-align: center; }
//         .spinner { animation: spin 1s linear infinite; color: #10b981; }
//         @keyframes spin { to { transform: rotate(360deg); } }

//         .empty-state { background: white; border-radius: 24px; padding: 60px; text-align: center; }
//         .empty-icon { width: 80px; height: 80px; background: #ecfdf5; border-radius: 40px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #10b981; }
//         .create-empty-btn { display: inline-flex; align-items: center; gap: 10px; padding: 12px 24px; background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: 16px; color: white; font-weight: 600; cursor: pointer; }

//         .pagination { display: flex; justify-content: center; gap: 10px; margin-top: 24px; }
//         .page-nav { padding: 8px 12px; border: 1px solid #e2e8f0; background: white; border-radius: 10px; cursor: pointer; }
//         .page-numbers { display: flex; gap: 6px; }
//         .page-number { width: 36px; height: 36px; border: 1px solid #e2e8f0; background: white; border-radius: 10px; cursor: pointer; }
//         .page-number.active { background: #10b981; border-color: #10b981; color: white; }

//         .error-box { background: #fee2e2; color: #dc2626; padding: 12px; border-radius: 12px; font-size: 13px; margin-bottom: 20px; }
//         .spinner-small { animation: spin 1s linear infinite; }

//         @media (max-width: 768px) {
//           .content-wrapper { padding: 20px 16px; }
//           .offers-grid { grid-template-columns: 1fr; }
//           .form-grid { grid-template-columns: 1fr; }
//           .form-group.full-width { grid-column: span 1; }
//           .search-filters-card { flex-direction: column; }
//           .filter-row { width: 100%; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Offers;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'https://userside-x164.onrender.com/api/offers';
const DOCTORS_API = 'https://userside-x164.onrender.com/api/doctors';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [specialtyFilter, setSpecialtyFilter] = useState('ALL');
  
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    desc: '',
    discount: '',
    specialty: 'General Physician',
    doctorId: '',
    isActive: true
  });

  const specialtyOptions = [
    'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist', 
    'Pediatrician', 'Orthopedic Surgeon', 'Gynecologist', 'Ophthalmologist', 
    'ENT Specialist', 'Psychiatrist', 'Dentist', 'Urologist',
    'Gastroenterologist', 'Endocrinologist', 'Nephrologist', 'Pulmonologist'
  ];

  useEffect(() => {
    fetchOffers();
    fetchDoctors();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API);
      console.log('Fetched offers:', response.data);
      const offersData = response.data?.data || [];
      setOffers(offersData);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch offers');
      setOffers([]);
    }
    setLoading(false);
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(DOCTORS_API);
      console.log('Fetched doctors for dropdown:', response.data);
      const doctorsData = response.data?.data || [];
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || formData.title.trim() === '') {
      toast.error('Offer title is required');
      return;
    }

    if (!formData.discount) {
      toast.error('Discount percentage is required');
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title.trim());
    if (formData.tagline) submitData.append('tagline', formData.tagline);
    if (formData.desc) submitData.append('desc', formData.desc);
    if (formData.discount) submitData.append('discount', formData.discount);
    if (formData.specialty) submitData.append('specialty', formData.specialty);
    if (formData.doctorId) submitData.append('doctorId', formData.doctorId);
    submitData.append('isActive', formData.isActive);
    if (imageFile) submitData.append('image', imageFile);

    try {
      if (editingOffer) {
        await axios.put(`${API}/${editingOffer._id}`, submitData);
        toast.success('Offer updated successfully');
      } else {
        await axios.post(API, submitData);
        toast.success('Offer created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchOffers();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to save offer');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await axios.delete(`${API}/${id}`);
        toast.success('Offer deleted successfully');
        fetchOffers();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete offer');
      }
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer?.title || '',
      tagline: offer?.tagline || '',
      desc: offer?.desc || '',
      discount: offer?.discount || '',
      specialty: offer?.specialty || 'General Physician',
      doctorId: offer?.doctorId?._id || offer?.doctorId || '',
      isActive: offer?.isActive === true
    });
    setImagePreview(offer?.image?.url || null);
    setImageFile(null);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingOffer(null);
    setFormData({
      title: '', tagline: '', desc: '', discount: '', 
      specialty: 'General Physician', doctorId: '', isActive: true
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Filter offers
  const filteredOffers = offers.filter(offer => {
    // Search filter
    if (searchTerm && !offer.title?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // Status filter
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'ACTIVE' && !offer.isActive) return false;
      if (statusFilter === 'INACTIVE' && offer.isActive) return false;
    }
    // Specialty filter
    if (specialtyFilter !== 'ALL' && offer.specialty !== specialtyFilter) {
      return false;
    }
    return true;
  });

  const totalOffers = offers.length;
  const activeOffers = offers.filter(o => o.isActive === true).length;
  const inactiveOffers = offers.filter(o => o.isActive === false).length;
  const avgDiscount = offers.reduce((sum, o) => sum + (parseInt(o.discount) || 0), 0) / (totalOffers || 1);

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Offers Management</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Manage promotional offers and discounts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          + Add New Offer
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{totalOffers}</div>
          <div style={{ color: '#64748b', marginTop: '4px' }}>Total Offers</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>{activeOffers}</div>
          <div style={{ color: '#64748b', marginTop: '4px' }}>Active Offers</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>{inactiveOffers}</div>
          <div style={{ color: '#64748b', marginTop: '4px' }}>Inactive Offers</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>{Math.round(avgDiscount)}%</div>
          <div style={{ color: '#64748b', marginTop: '4px' }}>Avg Discount</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search offers by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              background: 'white',
              outline: 'none'
            }}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>

          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              background: 'white',
              outline: 'none',
              minWidth: '160px'
            }}
          >
            <option value="ALL">All Specialties</option>
            {specialtyOptions.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Offers Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
          <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
          <p style={{ marginTop: '16px', color: '#64748b' }}>Loading offers...</p>
        </div>
      ) : filteredOffers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
          <div style={{ fontSize: '64px' }}>🏷️</div>
          <h3 style={{ margin: '16px 0 8px 0', color: '#1e293b' }}>No offers found</h3>
          <p style={{ color: '#64748b', margin: 0 }}>Click "Add New Offer" to get started</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {filteredOffers.map((offer) => (
            <div key={offer._id} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 20px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'; }}
            >
              <div style={{ height: '180px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {offer.image?.url ? (
                  <img src={offer.image.url} alt={offer.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '64px' }}>🏷️</span>
                )}
                <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#ef4444', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '16px', fontWeight: 'bold' }}>
                  {offer.discount}% OFF
                </div>
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <span style={{ 
                    background: offer.isActive ? '#10b981' : '#ef4444', 
                    color: 'white', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '11px', 
                    fontWeight: 'bold' 
                  }}>
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                    {offer.specialty}
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#1e293b' }}>{offer.title}</h3>
                {offer.tagline && <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 8px 0' }}>{offer.tagline}</p>}
                {offer.doctorId && (
                  <div style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569' }}>
                    <span>👨‍⚕️</span> Dr. {offer.doctorId.name}
                  </div>
                )}
                {offer.desc && (
                  <p style={{ color: '#64748b', fontSize: '13px', margin: '8px 0 0 0', lineHeight: '1.5' }}>
                    {offer.desc.substring(0, 80)}...
                  </p>
                )}
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button onClick={() => handleEdit(offer)} style={{ flex: 1, padding: '10px', background: '#fef3c7', color: '#d97706', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.target.style.background = '#fde68a'}
                    onMouseLeave={(e) => e.target.style.background = '#fef3c7'}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(offer._id)} style={{ flex: 1, padding: '10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.target.style.background = '#fecaca'}
                    onMouseLeave={(e) => e.target.style.background = '#fee2e2'}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'white', borderRadius: '24px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', borderRadius: '24px 24px 0 0' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #1e293b, #2d3748)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {editingOffer ? 'Edit Offer' : 'Add New Offer'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '12px', fontSize: '24px', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}>
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Offer Title <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px' }}
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  required 
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Tagline</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px' }}
                  value={formData.tagline} 
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} 
                  placeholder="Short catchy phrase"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Description</label>
                <textarea 
                  rows="3"
                  style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit' }}
                  value={formData.desc} 
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })} 
                  placeholder="Detailed description of the offer"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Discount (%) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input 
                    type="number" 
                    style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px' }}
                    value={formData.discount} 
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })} 
                    placeholder="e.g., 20, 30, 50"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Specialty</label>
                  <select 
                    style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', background: 'white' }}
                    value={formData.specialty} 
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  >
                    {specialtyOptions.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Assign to Doctor (Optional)</label>
                <select 
                  style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', background: 'white' }}
                  value={formData.doctorId} 
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                >
                  <option value="">-- Select Doctor --</option>
                  {doctors.map(doctor => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.name} - {doctor.speciality || doctor.degree || 'Doctor'}
                    </option>
                  ))}
                </select>
                {doctors.length === 0 && (
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    No doctors available. Add doctors first.
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Status</label>
                <select 
                  style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', background: 'white' }}
                  value={formData.isActive} 
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Offer Image</label>
                <div onClick={() => document.getElementById('imageInput').click()} style={{ border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: '#f8fafc' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.background = '#ecfdf5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}>
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" style={{ maxWidth: '150px', borderRadius: '12px' }} />
                      <button type="button" onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }} style={{ display: 'block', margin: '12px auto 0', background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>Remove</button>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '48px', marginBottom: '8px' }}>🖼️</div>
                      <p style={{ margin: 0, color: '#64748b' }}>Click to upload offer image</p>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>PNG, JPG up to 5MB</p>
                    </>
                  )}
                  <input id="imageInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '12px 24px', background: '#f1f5f9', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                  onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                  onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                  {editingOffer ? 'Update Offer' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}