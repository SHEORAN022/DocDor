


// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import toast from 'react-hot-toast';

// // const API = 'https://userside-x164.onrender.com/api/doctors';

// // const styles = `
// //   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

// //   .doctors-container {
// //     font-family: 'Inter', sans-serif;
// //     background: linear-gradient(135deg, #f5f7fa 0%, #f8f9fc 100%);
// //     min-height: 100vh;
// //     padding: 24px 32px;
// //   }

// //   /* Header Styles */
// //   .header-section {
// //     margin-bottom: 32px;
// //   }

// //   .header-title {
// //     font-size: 32px;
// //     font-weight: 800;
// //     background: linear-gradient(135deg, #1e293b 0%, #2d3748 100%);
// //     -webkit-background-clip: text;
// //     -webkit-text-fill-color: transparent;
// //     margin-bottom: 8px;
// //   }

// //   .header-subtitle {
// //     color: #64748b;
// //     font-size: 14px;
// //     font-weight: 500;
// //   }

// //   .add-doctor-btn {
// //     background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
// //     color: white;
// //     border: none;
// //     padding: 12px 28px;
// //     border-radius: 12px;
// //     font-weight: 600;
// //     font-size: 14px;
// //     cursor: pointer;
// //     display: flex;
// //     align-items: center;
// //     gap: 10px;
// //     transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
// //     box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
// //   }

// //   .add-doctor-btn:hover {
// //     transform: translateY(-2px);
// //     box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
// //   }

// //   /* Stats Cards */
// //   .stats-grid {
// //     display: grid;
// //     grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
// //     gap: 20px;
// //     margin-bottom: 32px;
// //   }

// //   .stat-card {
// //     background: white;
// //     border-radius: 20px;
// //     padding: 20px;
// //     transition: all 0.3s ease;
// //     box-shadow: 0 1px 3px rgba(0,0,0,0.05);
// //     border: 1px solid rgba(226, 232, 240, 0.8);
// //   }

// //   .stat-card:hover {
// //     transform: translateY(-4px);
// //     box-shadow: 0 20px 25px -12px rgba(0,0,0,0.1);
// //   }

// //   .stat-header {
// //     display: flex;
// //     justify-content: space-between;
// //     align-items: center;
// //     margin-bottom: 16px;
// //   }

// //   .stat-icon {
// //     width: 48px;
// //     height: 48px;
// //     border-radius: 16px;
// //     display: flex;
// //     align-items: center;
// //     justify-content: center;
// //     font-size: 24px;
// //   }

// //   .stat-value {
// //     font-size: 32px;
// //     font-weight: 800;
// //     color: #1e293b;
// //     margin-bottom: 4px;
// //   }

// //   .stat-label {
// //     font-size: 13px;
// //     font-weight: 500;
// //     color: #64748b;
// //   }

// //   /* Search Section */
// //   .search-section {
// //     background: white;
// //     border-radius: 20px;
// //     padding: 20px 24px;
// //     margin-bottom: 32px;
// //     box-shadow: 0 1px 3px rgba(0,0,0,0.05);
// //     border: 1px solid rgba(226, 232, 240, 0.8);
// //   }

// //   .search-wrapper {
// //     position: relative;
// //   }

// //   .search-icon {
// //     position: absolute;
// //     left: 16px;
// //     top: 50%;
// //     transform: translateY(-50%);
// //     color: #94a3b8;
// //   }

// //   .search-input {
// //     width: 100%;
// //     padding: 14px 16px 14px 48px;
// //     border: 1.5px solid #e2e8f0;
// //     border-radius: 14px;
// //     font-size: 14px;
// //     font-family: 'Inter', sans-serif;
// //     transition: all 0.2s;
// //     background: #f8fafc;
// //   }

// //   .search-input:focus {
// //     outline: none;
// //     border-color: #2563eb;
// //     background: white;
// //     box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
// //   }

// //   /* Doctors Grid */
// //   .doctors-grid {
// //     display: grid;
// //     grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
// //     gap: 24px;
// //   }

// //   /* Doctor Card */
// //   .doctor-card {
// //     background: white;
// //     border-radius: 24px;
// //     overflow: hidden;
// //     transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
// //     box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
// //     border: 1px solid rgba(226, 232, 240, 0.8);
// //   }

// //   .doctor-card:hover {
// //     transform: translateY(-8px);
// //     box-shadow: 0 20px 25px -12px rgba(0,0,0,0.15);
// //   }

// //   .card-image-wrapper {
// //     position: relative;
// //     height: 240px;
// //     overflow: hidden;
// //     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// //   }

// //   .doctor-image {
// //     width: 100%;
// //     height: 100%;
// //     object-fit: cover;
// //     transition: transform 0.5s ease;
// //   }

// //   .doctor-card:hover .doctor-image {
// //     transform: scale(1.1);
// //   }

// //   .image-placeholder {
// //     width: 100%;
// //     height: 100%;
// //     display: flex;
// //     align-items: center;
// //     justify-content: center;
// //     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// //   }

// //   .rating-badge {
// //     position: absolute;
// //     top: 16px;
// //     right: 16px;
// //     background: rgba(0,0,0,0.75);
// //     backdrop-filter: blur(8px);
// //     padding: 6px 12px;
// //     border-radius: 20px;
// //     display: flex;
// //     align-items: center;
// //     gap: 6px;
// //     color: #fbbf24;
// //     font-size: 13px;
// //     font-weight: 600;
// //   }

// //   .card-content {
// //     padding: 20px;
// //   }

// //   .doctor-name {
// //     font-size: 20px;
// //     font-weight: 700;
// //     color: #1e293b;
// //     margin-bottom: 6px;
// //     line-height: 1.3;
// //   }

// //   .doctor-degree {
// //     font-size: 13px;
// //     color: #64748b;
// //     font-weight: 500;
// //     margin-bottom: 16px;
// //   }

// //   .info-row {
// //     display: flex;
// //     align-items: center;
// //     gap: 10px;
// //     padding: 8px 0;
// //     border-bottom: 1px solid #f1f5f9;
// //   }

// //   .info-icon {
// //     font-size: 18px;
// //     min-width: 28px;
// //   }

// //   .info-text {
// //     font-size: 14px;
// //     color: #475569;
// //     font-weight: 500;
// //   }

// //   .info-text strong {
// //     color: #2563eb;
// //     font-weight: 700;
// //   }

// //   .fees-text {
// //     font-size: 18px;
// //     font-weight: 800;
// //     color: #2563eb;
// //   }

// //   .card-actions {
// //     display: flex;
// //     gap: 12px;
// //     margin-top: 20px;
// //     padding-top: 16px;
// //     border-top: 1.5px solid #e2e8f0;
// //   }

// //   .edit-btn, .delete-btn {
// //     flex: 1;
// //     padding: 10px;
// //     border: none;
// //     border-radius: 12px;
// //     font-weight: 600;
// //     font-size: 13px;
// //     cursor: pointer;
// //     display: flex;
// //     align-items: center;
// //     justify-content: center;
// //     gap: 8px;
// //     transition: all 0.2s;
// //   }

// //   .edit-btn {
// //     background: #fef3c7;
// //     color: #d97706;
// //   }

// //   .edit-btn:hover {
// //     background: #fde68a;
// //     transform: translateY(-2px);
// //   }

// //   .delete-btn {
// //     background: #fee2e2;
// //     color: #dc2626;
// //   }

// //   .delete-btn:hover {
// //     background: #fecaca;
// //     transform: translateY(-2px);
// //   }

// //   /* Modal Styles */
// //   .modal-overlay {
// //     position: fixed;
// //     top: 0;
// //     left: 0;
// //     right: 0;
// //     bottom: 0;
// //     background: rgba(0,0,0,0.6);
// //     backdrop-filter: blur(8px);
// //     display: flex;
// //     align-items: center;
// //     justify-content: center;
// //     z-index: 1000;
// //     animation: fadeIn 0.2s ease;
// //   }

// //   @keyframes fadeIn {
// //     from { opacity: 0; }
// //     to { opacity: 1; }
// //   }

// //   .modal-container {
// //     background: white;
// //     border-radius: 32px;
// //     width: 90%;
// //     max-width: 640px;
// //     max-height: 90vh;
// //     overflow-y: auto;
// //     animation: slideUp 0.3s ease;
// //   }

// //   @keyframes slideUp {
// //     from { transform: translateY(30px); opacity: 0; }
// //     to { transform: translateY(0); opacity: 1; }
// //   }

// //   .modal-header {
// //     padding: 24px 28px;
// //     border-bottom: 1.5px solid #e2e8f0;
// //     display: flex;
// //     justify-content: space-between;
// //     align-items: center;
// //     position: sticky;
// //     top: 0;
// //     background: white;
// //     border-radius: 32px 32px 0 0;
// //   }

// //   .modal-title {
// //     font-size: 24px;
// //     font-weight: 700;
// //     background: linear-gradient(135deg, #1e293b 0%, #2d3748 100%);
// //     -webkit-background-clip: text;
// //     -webkit-text-fill-color: transparent;
// //   }

// //   .close-modal {
// //     width: 36px;
// //     height: 36px;
// //     border-radius: 12px;
// //     border: none;
// //     background: #f1f5f9;
// //     font-size: 24px;
// //     cursor: pointer;
// //     color: #64748b;
// //     transition: all 0.2s;
// //   }

// //   .close-modal:hover {
// //     background: #e2e8f0;
// //     color: #1e293b;
// //   }

// //   .modal-body {
// //     padding: 28px;
// //   }

// //   .form-group {
// //     margin-bottom: 24px;
// //   }

// //   .form-label {
// //     display: block;
// //     font-size: 13px;
// //     font-weight: 700;
// //     color: #334155;
// //     margin-bottom: 8px;
// //   }

// //   .form-label .required {
// //     color: #ef4444;
// //     margin-left: 4px;
// //   }

// //   .form-input, .form-select {
// //     width: 100%;
// //     padding: 12px 16px;
// //     border: 1.5px solid #e2e8f0;
// //     border-radius: 14px;
// //     font-size: 14px;
// //     font-family: 'Inter', sans-serif;
// //     transition: all 0.2s;
// //     background: #f8fafc;
// //   }

// //   .form-input:focus, .form-select:focus {
// //     outline: none;
// //     border-color: #2563eb;
// //     background: white;
// //     box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
// //   }

// //   /* Image Upload Area */
// //   .upload-area {
// //     border: 2px dashed #cbd5e1;
// //     border-radius: 20px;
// //     padding: 24px;
// //     text-align: center;
// //     transition: all 0.2s;
// //     cursor: pointer;
// //     background: #f8fafc;
// //   }

// //   .upload-area:hover {
// //     border-color: #2563eb;
// //     background: #eff6ff;
// //   }

// //   .preview-image {
// //     max-width: 180px;
// //     max-height: 180px;
// //     border-radius: 16px;
// //     object-fit: cover;
// //     margin-bottom: 16px;
// //   }

// //   .remove-image {
// //     background: #ef4444;
// //     color: white;
// //     border: none;
// //     padding: 6px 12px;
// //     border-radius: 10px;
// //     font-size: 12px;
// //     cursor: pointer;
// //     margin-top: 8px;
// //   }

// //   .modal-footer {
// //     padding: 20px 28px;
// //     border-top: 1.5px solid #e2e8f0;
// //     display: flex;
// //     gap: 16px;
// //     justify-content: flex-end;
// //   }

// //   .btn-cancel, .btn-submit {
// //     padding: 12px 24px;
// //     border: none;
// //     border-radius: 14px;
// //     font-weight: 600;
// //     font-size: 14px;
// //     cursor: pointer;
// //     transition: all 0.2s;
// //   }

// //   .btn-cancel {
// //     background: #f1f5f9;
// //     color: #475569;
// //   }

// //   .btn-cancel:hover {
// //     background: #e2e8f0;
// //   }

// //   .btn-submit {
// //     background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
// //     color: white;
// //   }

// //   .btn-submit:hover {
// //     transform: translateY(-2px);
// //     box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
// //   }

// //   /* Loading & Empty States */
// //   .loading-container {
// //     display: flex;
// //     flex-direction: column;
// //     align-items: center;
// //     justify-content: center;
// //     min-height: 400px;
// //   }

// //   .spinner {
// //     width: 50px;
// //     height: 50px;
// //     border: 3px solid #e2e8f0;
// //     border-top-color: #2563eb;
// //     border-radius: 50%;
// //     animation: spin 0.8s linear infinite;
// //   }

// //   @keyframes spin {
// //     to { transform: rotate(360deg); }
// //   }

// //   .empty-state {
// //     text-align: center;
// //     padding: 80px 20px;
// //     background: white;
// //     border-radius: 24px;
// //   }

// //   .empty-icon {
// //     font-size: 80px;
// //     margin-bottom: 20px;
// //   }

// //   .empty-title {
// //     font-size: 20px;
// //     font-weight: 700;
// //     color: #1e293b;
// //     margin-bottom: 8px;
// //   }

// //   .empty-text {
// //     color: #64748b;
// //     font-size: 14px;
// //   }

// //   /* Responsive */
// //   @media (max-width: 768px) {
// //     .doctors-container {
// //       padding: 16px;
// //     }
// //     .header-title {
// //       font-size: 24px;
// //     }
// //     .stats-grid {
// //       grid-template-columns: 1fr;
// //     }
// //     .doctors-grid {
// //       grid-template-columns: 1fr;
// //     }
// //     .modal-container {
// //       width: 95%;
// //       margin: 16px;
// //     }
// //   }
// // `;

// // export default function Doctors() {
// //   const [doctors, setDoctors] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [showModal, setShowModal] = useState(false);
// //   const [editingDoctor, setEditingDoctor] = useState(null);
// //   const [imageFile, setImageFile] = useState(null);
// //   const [imagePreview, setImagePreview] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     degree: '',
// //     speciality: '',
// //     experience: '',
// //     fees: '',
// //   });

// //   const specialities = [
// //     'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician',
// //     'Orthopedic Surgeon', 'Gynecologist', 'Ophthalmologist', 'ENT Specialist',
// //     'Psychiatrist', 'Dentist', 'General Physician', 'Urologist',
// //     'Gastroenterologist', 'Endocrinologist', 'Nephrologist', 'Pulmonologist'
// //   ];

// //   const experienceOptions = [
// //     'Fresh Graduate', '1-2 Years', '3-5 Years', '6-10 Years',
// //     '11-15 Years', '16-20 Years', '20+ Years'
// //   ];

// //   useEffect(() => {
// //     fetchDoctors();
// //   }, [searchTerm]);

// //   const fetchDoctors = async () => {
// //     setLoading(true);
// //     try {
// //       const params = new URLSearchParams();
// //       if (searchTerm) params.append('search', searchTerm);
// //       const response = await axios.get(`${API}?${params}`);
// //       setDoctors(response.data.data);
// //     } catch (error) {
// //       toast.error('Failed to fetch doctors');
// //     }
// //     setLoading(false);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!formData.name) {
// //       toast.error('Doctor name is required');
// //       return;
// //     }

// //     const submitData = new FormData();
// //     submitData.append('name', formData.name);
// //     if (formData.degree) submitData.append('degree', formData.degree);
// //     if (formData.speciality) submitData.append('speciality', formData.speciality);
// //     if (formData.experience) submitData.append('experience', formData.experience);
// //     if (formData.fees) submitData.append('fees', formData.fees);
// //     if (imageFile) submitData.append('image', imageFile);

// //     try {
// //       if (editingDoctor) {
// //         await axios.put(`${API}/${editingDoctor._id}`, submitData);
// //         toast.success('Doctor updated successfully');
// //       } else {
// //         await axios.post(API, submitData);
// //         toast.success('Doctor added successfully');
// //       }
// //       setShowModal(false);
// //       resetForm();
// //       fetchDoctors();
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || 'Failed to save doctor');
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     if (window.confirm('Are you sure you want to delete this doctor?')) {
// //       try {
// //         await axios.delete(`${API}/${id}`);
// //         toast.success('Doctor deleted successfully');
// //         fetchDoctors();
// //       } catch (error) {
// //         toast.error('Failed to delete doctor');
// //       }
// //     }
// //   };

// //   const handleEdit = (doctor) => {
// //     setEditingDoctor(doctor);
// //     setFormData({
// //       name: doctor.name,
// //       degree: doctor.degree || '',
// //       speciality: doctor.speciality || '',
// //       experience: doctor.experience || '',
// //       fees: doctor.fees || '',
// //     });
// //     setImagePreview(doctor.image?.url);
// //     setImageFile(null);
// //     setShowModal(true);
// //   };

// //   const resetForm = () => {
// //     setEditingDoctor(null);
// //     setFormData({
// //       name: '', degree: '', speciality: '', experience: '', fees: '',
// //     });
// //     setImageFile(null);
// //     setImagePreview(null);
// //   };

// //   const handleImageChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       if (file.size > 5 * 1024 * 1024) {
// //         toast.error('Image size should be less than 5MB');
// //         return;
// //       }
// //       setImageFile(file);
// //       const reader = new FileReader();
// //       reader.onloadend = () => setImagePreview(reader.result);
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const totalDoctors = doctors.length;
// //   const avgFees = doctors.reduce((sum, doc) => sum + (doc.fees || 0), 0) / totalDoctors || 0;
// //   const experiencedDoctors = doctors.filter(d => d.experience && !d.experience.includes('Fresh')).length;

// //   return (
// //     <>
// //       <style>{styles}</style>
// //       <div className="doctors-container">
// //         {/* Header */}
// //         <div className="header-section">
// //           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
// //             <div>
// //               <h1 className="header-title">Doctor Management</h1>
// //               <p className="header-subtitle">Manage your healthcare professionals efficiently</p>
// //             </div>
// //             <button className="add-doctor-btn" onClick={() => setShowModal(true)}>
// //               <span>+</span> Add New Doctor
// //             </button>
// //           </div>
// //         </div>

// //         {/* Stats Cards */}
// //         <div className="stats-grid">
// //           <div className="stat-card">
// //             <div className="stat-header">
// //               <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>👨‍⚕️</div>
// //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
// //                 <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
// //               </svg>
// //             </div>
// //             <div className="stat-value">{totalDoctors}</div>
// //             <div className="stat-label">Total Doctors</div>
// //           </div>

// //           <div className="stat-card">
// //             <div className="stat-header">
// //               <div className="stat-icon" style={{ background: '#f0fdf4', color: '#10b981' }}>💰</div>
// //               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
// //                 <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
// //               </svg>
// //             </div>
// //             <div className="stat-value">₹{avgFees.toFixed(0)}</div>
// //             <div className="stat-label">Average Consultation Fee</div>
// //           </div>

// //           <div className="stat-card">
// //             <div className="stat-header">
// //               <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>⭐</div>
// //             </div>
// //             <div className="stat-value">{experiencedDoctors}</div>
// //             <div className="stat-label">Experienced Doctors</div>
// //           </div>
// //         </div>

// //         {/* Search Section */}
// //         <div className="search-section">
// //           <div className="search-wrapper">
// //             <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
// //             </svg>
// //             <input
// //               type="text"
// //               className="search-input"
// //               placeholder="Search doctors by name..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //             />
// //           </div>
// //         </div>

// //         {/* Doctors Grid */}
// //         {loading ? (
// //           <div className="loading-container">
// //             <div className="spinner"></div>
// //             <p style={{ marginTop: '16px', color: '#64748b' }}>Loading doctors...</p>
// //           </div>
// //         ) : doctors.length === 0 ? (
// //           <div className="empty-state">
// //             <div className="empty-icon">👨‍⚕️</div>
// //             <h3 className="empty-title">No doctors found</h3>
// //             <p className="empty-text">Click "Add New Doctor" to get started</p>
// //           </div>
// //         ) : (
// //           <div className="doctors-grid">
// //             {doctors.map((doctor) => (
// //               <div key={doctor._id} className="doctor-card">
// //                 <div className="card-image-wrapper">
// //                   {doctor.image?.url ? (
// //                     <img src={doctor.image.url} alt={doctor.name} className="doctor-image" />
// //                   ) : (
// //                     <div className="image-placeholder">
// //                       <span style={{ fontSize: '64px' }}>👨‍⚕️</span>
// //                     </div>
// //                   )}
// //                   {doctor.rating > 0 && (
// //                     <div className="rating-badge">
// //                       <span>⭐</span> {doctor.rating}
// //                     </div>
// //                   )}
// //                 </div>

// //                 <div className="card-content">
// //                   <h3 className="doctor-name">{doctor.name}</h3>
// //                   {doctor.degree && <p className="doctor-degree">{doctor.degree}</p>}
                  
// //                   {doctor.speciality && (
// //                     <div className="info-row">
// //                       <div className="info-icon">🎯</div>
// //                       <div className="info-text">{doctor.speciality}</div>
// //                     </div>
// //                   )}
                  
// //                   {doctor.experience && (
// //                     <div className="info-row">
// //                       <div className="info-icon">📅</div>
// //                       <div className="info-text">{doctor.experience}</div>
// //                     </div>
// //                   )}
                  
// //                   {doctor.fees > 0 && (
// //                     <div className="info-row">
// //                       <div className="info-icon">💰</div>
// //                       <div className="info-text fees-text">₹{doctor.fees}</div>
// //                     </div>
// //                   )}

// //                   <div className="card-actions">
// //                     <button className="edit-btn" onClick={() => handleEdit(doctor)}>
// //                       ✏️ Edit
// //                     </button>
// //                     <button className="delete-btn" onClick={() => handleDelete(doctor._id)}>
// //                       🗑️ Delete
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {/* Modal */}
// //         {showModal && (
// //           <div className="modal-overlay" onClick={() => setShowModal(false)}>
// //             <div className="modal-container" onClick={(e) => e.stopPropagation()}>
// //               <div className="modal-header">
// //                 <h2 className="modal-title">{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
// //                 <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
// //               </div>
              
// //               <form onSubmit={handleSubmit}>
// //                 <div className="modal-body">
// //                   <div className="form-group">
// //                     <label className="form-label">Doctor Name <span className="required">*</span></label>
// //                     <input
// //                       type="text"
// //                       className="form-input"
// //                       placeholder="Dr. John Doe"
// //                       value={formData.name}
// //                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
// //                       required
// //                     />
// //                   </div>

// //                   <div className="form-group">
// //                     <label className="form-label">Degree / Qualification</label>
// //                     <input
// //                       type="text"
// //                       className="form-input"
// //                       placeholder="MBBS, MD, MS"
// //                       value={formData.degree}
// //                       onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
// //                     />
// //                   </div>

// //                   <div className="form-group">
// //                     <label className="form-label">Speciality</label>
// //                     <select
// //                       className="form-select"
// //                       value={formData.speciality}
// //                       onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
// //                     >
// //                       <option value="">Select Speciality</option>
// //                       {specialities.map(spec => (
// //                         <option key={spec} value={spec}>{spec}</option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   <div className="form-group">
// //                     <label className="form-label">Experience</label>
// //                     <select
// //                       className="form-select"
// //                       value={formData.experience}
// //                       onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
// //                     >
// //                       <option value="">Select Experience</option>
// //                       {experienceOptions.map(exp => (
// //                         <option key={exp} value={exp}>{exp}</option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   <div className="form-group">
// //                     <label className="form-label">Consultation Fees (₹)</label>
// //                     <input
// //                       type="number"
// //                       className="form-input"
// //                       placeholder="500"
// //                       value={formData.fees}
// //                       onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
// //                     />
// //                   </div>

// //                   <div className="form-group">
// //                     <label className="form-label">Doctor Photo</label>
// //                     <div className="upload-area" onClick={() => document.getElementById('imageInput').click()}>
// //                       {imagePreview ? (
// //                         <>
// //                           <img src={imagePreview} alt="Preview" className="preview-image" />
// //                           <button
// //                             type="button"
// //                             className="remove-image"
// //                             onClick={(e) => {
// //                               e.stopPropagation();
// //                               setImageFile(null);
// //                               setImagePreview(null);
// //                             }}
// //                           >
// //                             Remove Photo
// //                           </button>
// //                         </>
// //                       ) : (
// //                         <>
// //                           <div style={{ fontSize: '48px', marginBottom: '12px' }}>📷</div>
// //                           <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>
// //                             Click to upload doctor's photo
// //                           </p>
// //                           <p style={{ color: '#94a3b8', fontSize: '12px' }}>PNG, JPG up to 5MB</p>
// //                         </>
// //                       )}
// //                       <input
// //                         id="imageInput"
// //                         type="file"
// //                         accept="image/*"
// //                         style={{ display: 'none' }}
// //                         onChange={handleImageChange}
// //                       />
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <div className="modal-footer">
// //                   <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
// //                     Cancel
// //                   </button>
// //                   <button type="submit" className="btn-submit">
// //                     {editingDoctor ? 'Update Doctor' : 'Create Doctor'}
// //                   </button>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </>
// //   );
// // }


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const API = 'https://userside-x164.onrender.com/api/doctors';

// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

//   .doctors-container {
//     font-family: 'Inter', sans-serif;
//     background: linear-gradient(135deg, #f5f7fa 0%, #f8f9fc 100%);
//     min-height: 100vh;
//     padding: 24px 32px;
//   }

//   .header-section {
//     margin-bottom: 32px;
//   }

//   .header-title {
//     font-size: 32px;
//     font-weight: 800;
//     background: linear-gradient(135deg, #1e293b 0%, #2d3748 100%);
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//     margin-bottom: 8px;
//   }

//   .header-subtitle {
//     color: #64748b;
//     font-size: 14px;
//     font-weight: 500;
//   }

//   .add-doctor-btn {
//     background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
//     color: white;
//     border: none;
//     padding: 12px 28px;
//     border-radius: 12px;
//     font-weight: 600;
//     font-size: 14px;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//     box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
//   }

//   .add-doctor-btn:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
//   }

//   .stats-grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
//     gap: 20px;
//     margin-bottom: 32px;
//   }

//   .stat-card {
//     background: white;
//     border-radius: 20px;
//     padding: 20px;
//     transition: all 0.3s ease;
//     box-shadow: 0 1px 3px rgba(0,0,0,0.05);
//     border: 1px solid rgba(226, 232, 240, 0.8);
//   }

//   .stat-card:hover {
//     transform: translateY(-4px);
//     box-shadow: 0 20px 25px -12px rgba(0,0,0,0.1);
//   }

//   .stat-header {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-bottom: 16px;
//   }

//   .stat-icon {
//     width: 48px;
//     height: 48px;
//     border-radius: 16px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 24px;
//   }

//   .stat-value {
//     font-size: 32px;
//     font-weight: 800;
//     color: #1e293b;
//     margin-bottom: 4px;
//   }

//   .stat-label {
//     font-size: 13px;
//     font-weight: 500;
//     color: #64748b;
//   }

//   .search-section {
//     background: white;
//     border-radius: 20px;
//     padding: 20px 24px;
//     margin-bottom: 32px;
//     box-shadow: 0 1px 3px rgba(0,0,0,0.05);
//     border: 1px solid rgba(226, 232, 240, 0.8);
//   }

//   .search-wrapper {
//     position: relative;
//   }

//   .search-icon {
//     position: absolute;
//     left: 16px;
//     top: 50%;
//     transform: translateY(-50%);
//     color: #94a3b8;
//   }

//   .search-input {
//     width: 100%;
//     padding: 14px 16px 14px 48px;
//     border: 1.5px solid #e2e8f0;
//     border-radius: 14px;
//     font-size: 14px;
//     font-family: 'Inter', sans-serif;
//     transition: all 0.2s;
//     background: #f8fafc;
//   }

//   .search-input:focus {
//     outline: none;
//     border-color: #2563eb;
//     background: white;
//     box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
//   }

//   .doctors-grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
//     gap: 24px;
//   }

//   .doctor-card {
//     background: white;
//     border-radius: 24px;
//     overflow: hidden;
//     transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//     box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
//     border: 1px solid rgba(226, 232, 240, 0.8);
//   }

//   .doctor-card:hover {
//     transform: translateY(-8px);
//     box-shadow: 0 20px 25px -12px rgba(0,0,0,0.15);
//   }

//   .card-image-wrapper {
//     position: relative;
//     height: 240px;
//     overflow: hidden;
//     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//   }

//   .doctor-image {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     transition: transform 0.5s ease;
//   }

//   .doctor-card:hover .doctor-image {
//     transform: scale(1.1);
//   }

//   .image-placeholder {
//     width: 100%;
//     height: 100%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//   }

//   .image-placeholder span {
//     font-size: 64px;
//   }

//   .rating-badge {
//     position: absolute;
//     top: 16px;
//     right: 16px;
//     background: rgba(0,0,0,0.75);
//     backdrop-filter: blur(8px);
//     padding: 6px 12px;
//     border-radius: 20px;
//     display: flex;
//     align-items: center;
//     gap: 6px;
//     color: #fbbf24;
//     font-size: 13px;
//     font-weight: 600;
//   }

//   .card-content {
//     padding: 20px;
//   }

//   .doctor-name {
//     font-size: 20px;
//     font-weight: 700;
//     color: #1e293b;
//     margin-bottom: 6px;
//     line-height: 1.3;
//   }

//   .doctor-degree {
//     font-size: 13px;
//     color: #64748b;
//     font-weight: 500;
//     margin-bottom: 12px;
//   }

//   .info-row {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     padding: 8px 0;
//     border-bottom: 1px solid #f1f5f9;
//   }

//   .info-icon {
//     font-size: 18px;
//     min-width: 28px;
//   }

//   .info-text {
//     font-size: 14px;
//     color: #475569;
//     font-weight: 500;
//   }

//   .info-text strong {
//     color: #2563eb;
//     font-weight: 700;
//   }

//   .fees-text {
//     font-size: 18px;
//     font-weight: 800;
//     color: #2563eb;
//   }

//   .location-text {
//     font-size: 12px;
//     color: #64748b;
//     margin-top: 4px;
//   }

//   .card-actions {
//     display: flex;
//     gap: 12px;
//     margin-top: 20px;
//     padding-top: 16px;
//     border-top: 1.5px solid #e2e8f0;
//   }

//   .edit-btn, .delete-btn {
//     flex: 1;
//     padding: 10px;
//     border: none;
//     border-radius: 12px;
//     font-weight: 600;
//     font-size: 13px;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     gap: 8px;
//     transition: all 0.2s;
//   }

//   .edit-btn {
//     background: #fef3c7;
//     color: #d97706;
//   }

//   .edit-btn:hover {
//     background: #fde68a;
//     transform: translateY(-2px);
//   }

//   .delete-btn {
//     background: #fee2e2;
//     color: #dc2626;
//   }

//   .delete-btn:hover {
//     background: #fecaca;
//     transform: translateY(-2px);
//   }

//   .modal-overlay {
//     position: fixed;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background: rgba(0,0,0,0.6);
//     backdrop-filter: blur(8px);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     z-index: 1000;
//     animation: fadeIn 0.2s ease;
//   }

//   @keyframes fadeIn {
//     from { opacity: 0; }
//     to { opacity: 1; }
//   }

//   .modal-container {
//     background: white;
//     border-radius: 32px;
//     width: 90%;
//     max-width: 700px;
//     max-height: 90vh;
//     overflow-y: auto;
//     animation: slideUp 0.3s ease;
//   }

//   @keyframes slideUp {
//     from { transform: translateY(30px); opacity: 0; }
//     to { transform: translateY(0); opacity: 1; }
//   }

//   .modal-header {
//     padding: 24px 28px;
//     border-bottom: 1.5px solid #e2e8f0;
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     position: sticky;
//     top: 0;
//     background: white;
//     border-radius: 32px 32px 0 0;
//   }

//   .modal-title {
//     font-size: 24px;
//     font-weight: 700;
//     background: linear-gradient(135deg, #1e293b 0%, #2d3748 100%);
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//   }

//   .close-modal {
//     width: 36px;
//     height: 36px;
//     border-radius: 12px;
//     border: none;
//     background: #f1f5f9;
//     font-size: 24px;
//     cursor: pointer;
//     color: #64748b;
//     transition: all 0.2s;
//   }

//   .close-modal:hover {
//     background: #e2e8f0;
//     color: #1e293b;
//   }

//   .modal-body {
//     padding: 28px;
//   }

//   .form-row {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 16px;
//     margin-bottom: 20px;
//   }

//   .form-group {
//     margin-bottom: 20px;
//   }

//   .form-label {
//     display: block;
//     font-size: 13px;
//     font-weight: 700;
//     color: #334155;
//     margin-bottom: 8px;
//   }

//   .form-label .required {
//     color: #ef4444;
//     margin-left: 4px;
//   }

//   .form-input, .form-select {
//     width: 100%;
//     padding: 12px 16px;
//     border: 1.5px solid #e2e8f0;
//     border-radius: 14px;
//     font-size: 14px;
//     font-family: 'Inter', sans-serif;
//     transition: all 0.2s;
//     background: #f8fafc;
//   }

//   .form-input:focus, .form-select:focus {
//     outline: none;
//     border-color: #2563eb;
//     background: white;
//     box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
//   }

//   .upload-area {
//     border: 2px dashed #cbd5e1;
//     border-radius: 20px;
//     padding: 24px;
//     text-align: center;
//     transition: all 0.2s;
//     cursor: pointer;
//     background: #f8fafc;
//   }

//   .upload-area:hover {
//     border-color: #2563eb;
//     background: #eff6ff;
//   }

//   .preview-image {
//     max-width: 180px;
//     max-height: 180px;
//     border-radius: 16px;
//     object-fit: cover;
//     margin-bottom: 16px;
//   }

//   .remove-image {
//     background: #ef4444;
//     color: white;
//     border: none;
//     padding: 6px 12px;
//     border-radius: 10px;
//     font-size: 12px;
//     cursor: pointer;
//     margin-top: 8px;
//   }

//   .modal-footer {
//     padding: 20px 28px;
//     border-top: 1.5px solid #e2e8f0;
//     display: flex;
//     gap: 16px;
//     justify-content: flex-end;
//   }

//   .btn-cancel, .btn-submit {
//     padding: 12px 24px;
//     border: none;
//     border-radius: 14px;
//     font-weight: 600;
//     font-size: 14px;
//     cursor: pointer;
//     transition: all 0.2s;
//   }

//   .btn-cancel {
//     background: #f1f5f9;
//     color: #475569;
//   }

//   .btn-cancel:hover {
//     background: #e2e8f0;
//   }

//   .btn-submit {
//     background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
//     color: white;
//   }

//   .btn-submit:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
//   }

//   .loading-container {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     min-height: 400px;
//   }

//   .spinner {
//     width: 50px;
//     height: 50px;
//     border: 3px solid #e2e8f0;
//     border-top-color: #2563eb;
//     border-radius: 50%;
//     animation: spin 0.8s linear infinite;
//   }

//   @keyframes spin {
//     to { transform: rotate(360deg); }
//   }

//   .empty-state {
//     text-align: center;
//     padding: 80px 20px;
//     background: white;
//     border-radius: 24px;
//   }

//   .empty-icon {
//     font-size: 80px;
//     margin-bottom: 20px;
//   }

//   .empty-title {
//     font-size: 20px;
//     font-weight: 700;
//     color: #1e293b;
//     margin-bottom: 8px;
//   }

//   .empty-text {
//     color: #64748b;
//     font-size: 14px;
//   }

//   @media (max-width: 768px) {
//     .doctors-container {
//       padding: 16px;
//     }
//     .header-title {
//       font-size: 24px;
//     }
//     .stats-grid {
//       grid-template-columns: 1fr;
//     }
//     .doctors-grid {
//       grid-template-columns: 1fr;
//     }
//     .modal-container {
//       width: 95%;
//       margin: 16px;
//     }
//     .form-row {
//       grid-template-columns: 1fr;
//       gap: 0;
//     }
//   }
// `;

// export default function Doctors() {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingDoctor, setEditingDoctor] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [gettingLocation, setGettingLocation] = useState(false);
  
//   const [formData, setFormData] = useState({
//     name: '',
//     degree: '',
//     speciality: '',
//     experience: '',
//     fees: '',
//     latitude: '',
//     longitude: '',
//     address: '',
//     city: '',
//     state: '',
//     pincode: ''
//   });

//   const specialities = [
//     'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician',
//     'Orthopedic Surgeon', 'Gynecologist', 'Ophthalmologist', 'ENT Specialist',
//     'Psychiatrist', 'Dentist', 'General Physician', 'Urologist',
//     'Gastroenterologist', 'Endocrinologist', 'Nephrologist', 'Pulmonologist'
//   ];

//   const experienceOptions = [
//     'Fresh Graduate', '1-2 Years', '3-5 Years', '6-10 Years',
//     '11-15 Years', '16-20 Years', '20+ Years'
//   ];

//   useEffect(() => {
//     fetchDoctors();
//   }, [searchTerm]);

//   const fetchDoctors = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (searchTerm) params.append('search', searchTerm);
//       const response = await axios.get(`${API}?${params}`);
//       setDoctors(response.data.data);
//     } catch (error) {
//       toast.error('Failed to fetch doctors');
//       console.error(error);
//     }
//     setLoading(false);
//   };

//   const getCurrentLocation = () => {
//     setGettingLocation(true);
//     if (!navigator.geolocation) {
//       toast.error('Geolocation is not supported by your browser');
//       setGettingLocation(false);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setFormData({
//           ...formData,
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude
//         });
//         toast.success('Location captured successfully');
//         setGettingLocation(false);
//       },
//       (error) => {
//         console.error('Location error:', error);
//         toast.error('Unable to get location. Please enter manually.');
//         setGettingLocation(false);
//       }
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.name) {
//       toast.error('Doctor name is required');
//       return;
//     }

//     if (!formData.latitude || !formData.longitude) {
//       toast.error('Please provide location (latitude & longitude)');
//       return;
//     }

//     const submitData = new FormData();
//     submitData.append('name', formData.name);
//     if (formData.degree) submitData.append('degree', formData.degree);
//     if (formData.speciality) submitData.append('speciality', formData.speciality);
//     if (formData.experience) submitData.append('experience', formData.experience);
//     if (formData.fees) submitData.append('fees', formData.fees);
//     if (formData.latitude) submitData.append('latitude', formData.latitude);
//     if (formData.longitude) submitData.append('longitude', formData.longitude);
//     if (formData.address) submitData.append('address', formData.address);
//     if (formData.city) submitData.append('city', formData.city);
//     if (formData.state) submitData.append('state', formData.state);
//     if (formData.pincode) submitData.append('pincode', formData.pincode);
//     if (imageFile) submitData.append('image', imageFile);

//     try {
//       if (editingDoctor) {
//         await axios.put(`${API}/${editingDoctor._id}`, submitData);
//         toast.success('Doctor updated successfully');
//       } else {
//         await axios.post(API, submitData);
//         toast.success('Doctor added successfully');
//       }
//       setShowModal(false);
//       resetForm();
//       fetchDoctors();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to save doctor');
//       console.error(error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this doctor?')) {
//       try {
//         await axios.delete(`${API}/${id}`);
//         toast.success('Doctor deleted successfully');
//         fetchDoctors();
//       } catch (error) {
//         toast.error('Failed to delete doctor');
//         console.error(error);
//       }
//     }
//   };

//   const handleEdit = (doctor) => {
//     setEditingDoctor(doctor);
//     setFormData({
//       name: doctor.name || '',
//       degree: doctor.degree || '',
//       speciality: doctor.speciality || '',
//       experience: doctor.experience || '',
//       fees: doctor.fees || '',
//       latitude: doctor.location?.coordinates?.[1] || '',
//       longitude: doctor.location?.coordinates?.[0] || '',
//       address: doctor.address || '',
//       city: doctor.city || '',
//       state: doctor.state || '',
//       pincode: doctor.pincode || ''
//     });
//     setImagePreview(doctor.image?.url);
//     setImageFile(null);
//     setShowModal(true);
//   };

//   const resetForm = () => {
//     setEditingDoctor(null);
//     setFormData({
//       name: '', degree: '', speciality: '', experience: '', fees: '',
//       latitude: '', longitude: '', address: '', city: '', state: '', pincode: ''
//     });
//     setImageFile(null);
//     setImagePreview(null);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error('Image size should be less than 5MB');
//         return;
//       }
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setImagePreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const totalDoctors = doctors.length;
//   const avgFees = doctors.reduce((sum, doc) => sum + (doc.fees || 0), 0) / totalDoctors || 0;
//   const experiencedDoctors = doctors.filter(d => d.experience && !d.experience.includes('Fresh')).length;

//   return (
//     <>
//       <style>{styles}</style>
//       <div className="doctors-container">
//         <div className="header-section">
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
//             <div>
//               <h1 className="header-title">Doctor Management</h1>
//               <p className="header-subtitle">Manage your healthcare professionals efficiently</p>
//             </div>
//             <button className="add-doctor-btn" onClick={() => setShowModal(true)}>
//               <span>+</span> Add New Doctor
//             </button>
//           </div>
//         </div>

//         <div className="stats-grid">
//           <div className="stat-card">
//             <div className="stat-header">
//               <div className="stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>👨‍⚕️</div>
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
//                 <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
//               </svg>
//             </div>
//             <div className="stat-value">{totalDoctors}</div>
//             <div className="stat-label">Total Doctors</div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-header">
//               <div className="stat-icon" style={{ background: '#f0fdf4', color: '#10b981' }}>💰</div>
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
//                 <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
//               </svg>
//             </div>
//             <div className="stat-value">₹{avgFees.toFixed(0)}</div>
//             <div className="stat-label">Average Consultation Fee</div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-header">
//               <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>⭐</div>
//             </div>
//             <div className="stat-value">{experiencedDoctors}</div>
//             <div className="stat-label">Experienced Doctors</div>
//           </div>
//         </div>

//         <div className="search-section">
//           <div className="search-wrapper">
//             <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//             <input
//               type="text"
//               className="search-input"
//               placeholder="Search doctors by name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         {loading ? (
//           <div className="loading-container">
//             <div className="spinner"></div>
//             <p style={{ marginTop: '16px', color: '#64748b' }}>Loading doctors...</p>
//           </div>
//         ) : doctors.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-icon">👨‍⚕️</div>
//             <h3 className="empty-title">No doctors found</h3>
//             <p className="empty-text">Click "Add New Doctor" to get started</p>
//           </div>
//         ) : (
//           <div className="doctors-grid">
//             {doctors.map((doctor) => (
//               <div key={doctor._id} className="doctor-card">
//                 <div className="card-image-wrapper">
//                   {doctor.image?.url ? (
//                     <img src={doctor.image.url} alt={doctor.name} className="doctor-image" />
//                   ) : (
//                     <div className="image-placeholder">
//                       <span>👨‍⚕️</span>
//                     </div>
//                   )}
//                   {doctor.rating > 0 && (
//                     <div className="rating-badge">
//                       <span>⭐</span> {doctor.rating}
//                     </div>
//                   )}
//                 </div>

//                 <div className="card-content">
//                   <h3 className="doctor-name">{doctor.name}</h3>
//                   {doctor.degree && <p className="doctor-degree">{doctor.degree}</p>}
                  
//                   {doctor.speciality && (
//                     <div className="info-row">
//                       <div className="info-icon">🎯</div>
//                       <div className="info-text">{doctor.speciality}</div>
//                     </div>
//                   )}
                  
//                   {doctor.experience && (
//                     <div className="info-row">
//                       <div className="info-icon">📅</div>
//                       <div className="info-text">{doctor.experience}</div>
//                     </div>
//                   )}
                  
//                   {doctor.fees > 0 && (
//                     <div className="info-row">
//                       <div className="info-icon">💰</div>
//                       <div className="info-text fees-text">₹{doctor.fees}</div>
//                     </div>
//                   )}

//                   {(doctor.address || doctor.city) && (
//                     <div className="info-row">
//                       <div className="info-icon">📍</div>
//                       <div className="info-text">
//                         {doctor.address && <div>{doctor.address}</div>}
//                         {doctor.city && <div>{doctor.city}, {doctor.state}</div>}
//                         {doctor.pincode && <div className="location-text">PIN: {doctor.pincode}</div>}
//                       </div>
//                     </div>
//                   )}

//                   <div className="card-actions">
//                     <button className="edit-btn" onClick={() => handleEdit(doctor)}>
//                       ✏️ Edit
//                     </button>
//                     <button className="delete-btn" onClick={() => handleDelete(doctor._id)}>
//                       🗑️ Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {showModal && (
//           <div className="modal-overlay" onClick={() => setShowModal(false)}>
//             <div className="modal-container" onClick={(e) => e.stopPropagation()}>
//               <div className="modal-header">
//                 <h2 className="modal-title">{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
//                 <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
//               </div>
              
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-body">
//                   <div className="form-group">
//                     <label className="form-label">Doctor Name <span className="required">*</span></label>
//                     <input
//                       type="text"
//                       className="form-input"
//                       placeholder="Dr. John Doe"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       required
//                     />
//                   </div>

//                   <div className="form-row">
//                     <div className="form-group">
//                       <label className="form-label">Degree / Qualification</label>
//                       <input
//                         type="text"
//                         className="form-input"
//                         placeholder="MBBS, MD, MS"
//                         value={formData.degree}
//                         onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
//                       />
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label">Consultation Fees (₹)</label>
//                       <input
//                         type="number"
//                         className="form-input"
//                         placeholder="500"
//                         value={formData.fees}
//                         onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
//                       />
//                     </div>
//                   </div>

//                   <div className="form-row">
//                     <div className="form-group">
//                       <label className="form-label">Speciality</label>
//                       <select
//                         className="form-select"
//                         value={formData.speciality}
//                         onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
//                       >
//                         <option value="">Select Speciality</option>
//                         {specialities.map(spec => (
//                           <option key={spec} value={spec}>{spec}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div className="form-group">
//                       <label className="form-label">Experience</label>
//                       <select
//                         className="form-select"
//                         value={formData.experience}
//                         onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
//                       >
//                         <option value="">Select Experience</option>
//                         {experienceOptions.map(exp => (
//                           <option key={exp} value={exp}>{exp}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="form-group">
//                     <label className="form-label">Location <span className="required">*</span></label>
//                     <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
//                       <button
//                         type="button"
//                         className="edit-btn"
//                         style={{ background: '#2563eb', color: 'white', flex: 1 }}
//                         onClick={getCurrentLocation}
//                         disabled={gettingLocation}
//                       >
//                         {gettingLocation ? 'Getting Location...' : '📍 Get Current Location'}
//                       </button>
//                     </div>
//                     <div className="form-row">
//                       <div className="form-group">
//                         <input
//                           type="text"
//                           className="form-input"
//                           placeholder="Latitude"
//                           value={formData.latitude}
//                           onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
//                         />
//                       </div>
//                       <div className="form-group">
//                         <input
//                           type="text"
//                           className="form-input"
//                           placeholder="Longitude"
//                           value={formData.longitude}
//                           onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="form-group">
//                     <label className="form-label">Address</label>
//                     <input
//                       type="text"
//                       className="form-input"
//                       placeholder="Street address"
//                       value={formData.address}
//                       onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                     />
//                   </div>

//                   <div className="form-row">
//                     <div className="form-group">
//                       <input
//                         type="text"
//                         className="form-input"
//                         placeholder="City"
//                         value={formData.city}
//                         onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                       />
//                     </div>
//                     <div className="form-group">
//                       <input
//                         type="text"
//                         className="form-input"
//                         placeholder="State"
//                         value={formData.state}
//                         onChange={(e) => setFormData({ ...formData, state: e.target.value })}
//                       />
//                     </div>
//                   </div>

//                   <div className="form-group">
//                     <input
//                       type="text"
//                       className="form-input"
//                       placeholder="Pincode"
//                       value={formData.pincode}
//                       onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label className="form-label">Doctor Photo</label>
//                     <div className="upload-area" onClick={() => document.getElementById('imageInput').click()}>
//                       {imagePreview ? (
//                         <>
//                           <img src={imagePreview} alt="Preview" className="preview-image" />
//                           <button
//                             type="button"
//                             className="remove-image"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setImageFile(null);
//                               setImagePreview(null);
//                             }}
//                           >
//                             Remove Photo
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <div style={{ fontSize: '48px', marginBottom: '12px' }}>📷</div>
//                           <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>
//                             Click to upload doctor's photo
//                           </p>
//                           <p style={{ color: '#94a3b8', fontSize: '12px' }}>PNG, JPG up to 5MB</p>
//                         </>
//                       )}
//                       <input
//                         id="imageInput"
//                         type="file"
//                         accept="image/*"
//                         style={{ display: 'none' }}
//                         onChange={handleImageChange}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="modal-footer">
//                   <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
//                     Cancel
//                   </button>
//                   <button type="submit" className="btn-submit">
//                     {editingDoctor ? 'Update Doctor' : 'Create Doctor'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'https://userside-x164.onrender.com/api/doctors';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [approvingId, setApprovingId] = useState(null);
  const [blockingId, setBlockingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    degree: '',
    qualification: '',
    speciality: '',
    experience: '',
    fees: '',
    latitude: '',
    longitude: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const specialities = [
    'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician',
    'Orthopedic Surgeon', 'Gynecologist', 'Ophthalmologist', 'ENT Specialist',
    'Psychiatrist', 'Dentist', 'General Physician', 'Urologist',
    'Gastroenterologist', 'Endocrinologist', 'Nephrologist', 'Pulmonologist'
  ];

  const experienceOptions = [
    'Fresh Graduate', '1-2 Years', '3-5 Years', '6-10 Years',
    '11-15 Years', '16-20 Years', '20+ Years'
  ];

  useEffect(() => {
    fetchDoctors();
  }, []); // Removed searchTerm dependency to avoid unnecessary calls

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API);
      console.log('Fetched doctors:', response.data);
      
      // Ensure doctors is always an array
      const doctorsData = response.data?.data || [];
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch doctors');
      setDoctors([]);
    }
    setLoading(false);
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        toast.success('Location captured');
        setGettingLocation(false);
      },
      (error) => {
        console.error('Location error:', error);
        toast.error('Unable to get location');
        setGettingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || formData.name.trim() === '') {
      toast.error('Doctor name is required');
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      toast.error('Please provide location (latitude & longitude)');
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name.trim());
    if (formData.email) submitData.append('email', formData.email);
    if (formData.phoneNumber) submitData.append('phoneNumber', formData.phoneNumber);
    if (formData.degree) submitData.append('degree', formData.degree);
    if (formData.qualification) submitData.append('qualification', formData.qualification);
    if (formData.speciality) submitData.append('speciality', formData.speciality);
    if (formData.experience) submitData.append('experience', formData.experience);
    if (formData.fees) submitData.append('fees', formData.fees);
    if (formData.latitude) submitData.append('latitude', formData.latitude);
    if (formData.longitude) submitData.append('longitude', formData.longitude);
    if (formData.address) submitData.append('address', formData.address);
    if (formData.city) submitData.append('city', formData.city);
    if (formData.state) submitData.append('state', formData.state);
    if (formData.pincode) submitData.append('pincode', formData.pincode);
    if (imageFile) submitData.append('image', imageFile);

    try {
      if (editingDoctor) {
        await axios.put(`${API}/${editingDoctor._id}`, submitData);
        toast.success('Doctor updated successfully');
      } else {
        await axios.post(API, submitData);
        toast.success('Doctor added successfully');
      }
      setShowModal(false);
      resetForm();
      fetchDoctors();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to save doctor');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await axios.delete(`${API}/${id}`);
        toast.success('Doctor deleted successfully');
        fetchDoctors();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete doctor');
      }
    }
  };

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      await axios.put(`${API}/approve/${id}`);
      toast.success('Doctor approved successfully');
      fetchDoctors();
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Failed to approve doctor');
    }
    setApprovingId(null);
  };

  const handleBlock = async (id) => {
    setBlockingId(id);
    try {
      await axios.put(`${API}/block/${id}`);
      toast.success('Status updated successfully');
      fetchDoctors();
    } catch (error) {
      console.error('Block error:', error);
      toast.error('Failed to update block status');
    }
    setBlockingId(null);
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor?.name || '',
      email: doctor?.email || '',
      phoneNumber: doctor?.phoneNumber || '',
      degree: doctor?.degree || '',
      qualification: doctor?.qualification || '',
      speciality: doctor?.speciality || '',
      experience: doctor?.experience || '',
      fees: doctor?.fees || '',
      latitude: doctor?.location?.coordinates?.[1] || '',
      longitude: doctor?.location?.coordinates?.[0] || '',
      address: doctor?.address || '',
      city: doctor?.city || '',
      state: doctor?.state || '',
      pincode: doctor?.pincode || ''
    });
    setImagePreview(doctor?.image?.url || null);
    setImageFile(null);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingDoctor(null);
    setFormData({
      name: '', email: '', phoneNumber: '', degree: '', qualification: '',
      speciality: '', experience: '', fees: '', latitude: '', longitude: '',
      address: '', city: '', state: '', pincode: ''
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

  // Filter doctors with safe check for undefined name
  const filteredDoctors = doctors.filter(doctor => {
    if (!doctor || !doctor.name) return false;
    return doctor.name.toLowerCase().includes((searchTerm || '').toLowerCase());
  });

  const totalDoctors = doctors.length;
  const approvedDoctors = doctors.filter(d => d && d.isApproved === true).length;
  const blockedDoctors = doctors.filter(d => d && d.isBlocked === true).length;
  const avgFees = doctors.reduce((sum, doc) => sum + (doc?.fees || 0), 0) / (totalDoctors || 1);

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Doctor Management</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Manage your healthcare professionals efficiently</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #2563eb, #1e40af)',
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
          + Add New Doctor
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>{totalDoctors}</div>
          <div style={{ color: '#64748b', marginTop: '4px' }}>Total Doctors</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{approvedDoctors}</div>
          <div style={{ color: '#64748b', marginTop: '4px' }}>Approved</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>{blockedDoctors}</div>
          <div style={{ color: '#64748b', marginTop: '4px' }}>Blocked</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>₹{Math.round(avgFees)}</div>
          <div style={{ color: '#64748b', marginTop: '4px' }}>Avg Consultation Fee</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ background: 'white', padding: '16px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <input
          type="text"
          placeholder="Search doctors by name..."
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
          onFocus={(e) => e.target.style.borderColor = '#2563eb'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
          <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
          <p style={{ marginTop: '16px', color: '#64748b' }}>Loading doctors...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
          <div style={{ fontSize: '64px' }}>👨‍⚕️</div>
          <h3 style={{ margin: '16px 0 8px 0', color: '#1e293b' }}>No doctors found</h3>
          <p style={{ color: '#64748b', margin: 0 }}>Click "Add New Doctor" to get started</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {filteredDoctors.map((doctor) => (
            <div key={doctor._id} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 20px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'; }}
            >
              <div style={{ height: '200px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {doctor.image?.url ? (
                  <img src={doctor.image.url} alt={doctor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '64px' }}>👨‍⚕️</span>
                )}
                {doctor.rating > 0 && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', padding: '4px 10px', borderRadius: '20px', color: '#fbbf24', fontSize: '12px', fontWeight: 'bold' }}>
                    ⭐ {doctor.rating}
                  </div>
                )}
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>{doctor.name || 'Unnamed Doctor'}</h3>
                  <div>
                    {doctor.isApproved ? (
                      <span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>✓ Approved</span>
                    ) : (
                      <span style={{ background: '#fed7aa', color: '#92400e', padding: '4px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>⏳ Pending</span>
                    )}
                  </div>
                </div>
                {doctor.degree && <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 12px 0' }}>{doctor.degree}</p>}
                
                {doctor.speciality && (
                  <div style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🎯</span>
                    <span style={{ color: '#475569', fontSize: '14px' }}>{doctor.speciality}</span>
                  </div>
                )}
                {doctor.experience && (
                  <div style={{ margin: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📅</span>
                    <span style={{ color: '#475569', fontSize: '14px' }}>{doctor.experience}</span>
                  </div>
                )}
                {doctor.fees > 0 && (
                  <div style={{ margin: '8px 0', fontSize: '20px', fontWeight: 'bold', color: '#2563eb' }}>
                    ₹{doctor.fees}
                  </div>
                )}
                {doctor.city && (
                  <div style={{ margin: '8px 0', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>📍</span> {doctor.city}, {doctor.state || ''}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                  <button onClick={() => handleEdit(doctor)} style={{ flex: 1, padding: '8px', background: '#fef3c7', color: '#d97706', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.target.style.background = '#fde68a'}
                    onMouseLeave={(e) => e.target.style.background = '#fef3c7'}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(doctor._id)} style={{ flex: 1, padding: '8px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.target.style.background = '#fecaca'}
                    onMouseLeave={(e) => e.target.style.background = '#fee2e2'}>
                    🗑️ Delete
                  </button>
                  {!doctor.isApproved && (
                    <button onClick={() => handleApprove(doctor._id)} disabled={approvingId === doctor._id} style={{ flex: 1, padding: '8px', background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                      {approvingId === doctor._id ? '...' : '✓ Approve'}
                    </button>
                  )}
                  <button onClick={() => handleBlock(doctor._id)} disabled={blockingId === doctor._id} style={{ flex: 1, padding: '8px', background: doctor.isBlocked ? '#d1fae5' : '#fef3c7', color: doctor.isBlocked ? '#065f46' : '#d97706', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {blockingId === doctor._id ? '...' : (doctor.isBlocked ? '🔓 Unblock' : '🔒 Block')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowModal(false)}>
          <div style={{ background: 'white', borderRadius: '24px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', borderRadius: '24px 24px 0 0' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #1e293b, #2d3748)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '12px', fontSize: '24px', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}>
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Doctor Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', transition: 'all 0.2s' }}
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Email</label>
                  <input type="email" style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px' }} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Phone Number</label>
                  <input type="text" style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px' }} value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Degree</label>
                  <input type="text" style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px' }} value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Qualification</label>
                  <input type="text" style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px' }} value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Speciality</label>
                  <select style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', background: 'white' }} value={formData.speciality} onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}>
                    <option value="">Select Speciality</option>
                    {specialities.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Experience</label>
                  <select style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', background: 'white' }} value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })}>
                    <option value="">Select Experience</option>
                    {experienceOptions.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Consultation Fees (₹)</label>
                <input type="number" style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px' }} value={formData.fees} onChange={(e) => setFormData({ ...formData, fees: e.target.value })} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Location <span style={{ color: '#ef4444' }}>*</span></label>
                <button type="button" onClick={getCurrentLocation} disabled={gettingLocation} style={{ marginBottom: '12px', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>
                  {gettingLocation ? '📍 Getting Location...' : '📍 Get Current Location'}
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input type="text" placeholder="Latitude" style={{ padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px' }} value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} />
                  <input type="text" placeholder="Longitude" style={{ padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px' }} value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Address</label>
                <input type="text" style={{ width: '100%', padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px' }} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <input type="text" placeholder="City" style={{ padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px' }} value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                <input type="text" placeholder="State" style={{ padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px' }} value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                <input type="text" placeholder="Pincode" style={{ padding: '12px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px' }} value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Doctor Photo</label>
                <div onClick={() => document.getElementById('imageInput').click()} style={{ border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: '#f8fafc' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#eff6ff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}>
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" style={{ maxWidth: '150px', borderRadius: '12px' }} />
                      <button type="button" onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }} style={{ display: 'block', margin: '12px auto 0', background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}>Remove Photo</button>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '48px', marginBottom: '8px' }}>📷</div>
                      <p style={{ margin: 0, color: '#64748b' }}>Click to upload doctor's photo</p>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>PNG, JPG up to 5MB</p>
                    </>
                  )}
                  <input id="imageInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '12px 24px', background: '#f1f5f9', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                  onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #2563eb, #1e40af)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                  {editingDoctor ? 'Update Doctor' : 'Create Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}