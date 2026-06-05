import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'https://userside-x164.onrender.com/api/online-symptoms';
const DOCTOR_API = 'https://userside-x164.onrender.com/api/doctors';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .online-symptoms-container {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    min-height: 100vh;
    padding: 24px 32px;
  }

  /* Header Styles */
  .header-section {
    margin-bottom: 32px;
  }

  .header-title {
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #92400e 0%, #78350f 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
  }

  .header-subtitle {
    color: #78350f;
    font-size: 14px;
    font-weight: 500;
  }

  .add-symptom-btn {
    background: linear-gradient(135deg, #d97706 0%, #92400e 100%);
    color: white;
    border: none;
    padding: 12px 28px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px -1px rgba(217, 119, 6, 0.2);
  }

  .add-symptom-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(217, 119, 6, 0.3);
  }

  /* Stats Cards */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: white;
    border-radius: 20px;
    padding: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border: 1px solid rgba(226, 232, 240, 0.8);
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -12px rgba(0,0,0,0.1);
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
  }

  /* Search Section */
  .search-section {
    background: white;
    border-radius: 20px;
    padding: 20px 24px;
    margin-bottom: 32px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border: 1px solid rgba(226, 232, 240, 0.8);
  }

  .search-wrapper {
    position: relative;
  }

  .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }

  .search-input {
    width: 100%;
    padding: 14px 16px 14px 48px;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
    background: #f8fafc;
  }

  .search-input:focus {
    outline: none;
    border-color: #d97706;
    background: white;
    box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
  }

  /* Symptoms Grid */
  .symptoms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  /* Symptom Card */
  .symptom-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    border: 1px solid rgba(226, 232, 240, 0.8);
  }

  .symptom-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -12px rgba(0,0,0,0.15);
  }

  .card-image-wrapper {
    position: relative;
    height: 200px;
    overflow: hidden;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }

  .symptom-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .symptom-card:hover .symptom-image {
    transform: scale(1.1);
  }

  .image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }

  .online-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    background: #10b981;
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .color-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: 3px solid white;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .card-content {
    padding: 20px;
  }

  .symptom-name {
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 16px;
    line-height: 1.3;
  }

  .doctors-section {
    margin-bottom: 20px;
  }

  .doctors-label {
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
  }

  .doctors-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .doctor-tag {
    background: #fef3c7;
    color: #92400e;
    padding: 6px 12px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .card-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1.5px solid #e2e8f0;
  }

  .edit-btn, .delete-btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
  }

  .edit-btn {
    background: #fef3c7;
    color: #d97706;
  }

  .edit-btn:hover {
    background: #fde68a;
    transform: translateY(-2px);
  }

  .delete-btn {
    background: #fee2e2;
    color: #dc2626;
  }

  .delete-btn:hover {
    background: #fecaca;
    transform: translateY(-2px);
  }

  /* Pagination Styles */
  .pagination-section {
    background: white;
    border-radius: 20px;
    padding: 20px 24px;
    margin-top: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border: 1px solid rgba(226, 232, 240, 0.8);
  }

  .pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }

  .pagination-info {
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
  }

  .pagination-controls {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  .page-btn {
    min-width: 40px;
    height: 40px;
    padding: 0 12px;
    border: 1.5px solid #e2e8f0;
    background: white;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s;
    color: #475569;
  }

  .page-btn:hover:not(:disabled) {
    background: #f1f5f9;
    border-color: #d97706;
    color: #d97706;
  }

  .page-btn.active {
    background: linear-gradient(135deg, #d97706 0%, #92400e 100%);
    color: white;
    border-color: #d97706;
  }

  .page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .page-numbers {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  .per-page-select {
    padding: 8px 12px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    background: white;
    cursor: pointer;
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-container {
    background: white;
    border-radius: 32px;
    width: 90%;
    max-width: 640px;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .modal-header {
    padding: 24px 28px;
    border-bottom: 1.5px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background: white;
    border-radius: 32px 32px 0 0;
    z-index: 1;
  }

  .modal-title {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #92400e 0%, #78350f 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .close-modal {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    border: none;
    background: #f1f5f9;
    font-size: 24px;
    cursor: pointer;
    color: #64748b;
    transition: all 0.2s;
  }

  .close-modal:hover {
    background: #e2e8f0;
    color: #1e293b;
  }

  .modal-body {
    padding: 28px;
  }

  .form-group {
    margin-bottom: 24px;
  }

  .form-label {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: #334155;
    margin-bottom: 8px;
  }

  .form-label .required {
    color: #ef4444;
    margin-left: 4px;
  }

  .form-input, .form-select {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
    background: #f8fafc;
  }

  .form-input:focus, .form-select:focus {
    outline: none;
    border-color: #d97706;
    background: white;
    box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
  }

  /* Image Upload Area */
  .upload-area {
    border: 2px dashed #cbd5e1;
    border-radius: 20px;
    padding: 24px;
    text-align: center;
    transition: all 0.2s;
    cursor: pointer;
    background: #f8fafc;
    position: relative;
  }

  .upload-area:hover {
    border-color: #d97706;
    background: #fef3c7;
  }

  .upload-area.drag-over {
    border-color: #d97706;
    background: #fde68a;
  }

  .preview-image {
    max-width: 200px;
    max-height: 200px;
    border-radius: 16px;
    object-fit: cover;
    margin-bottom: 16px;
  }

  .remove-image-btn {
    background: #ef4444;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 10px;
    font-size: 12px;
    cursor: pointer;
    margin-top: 8px;
    transition: all 0.2s;
  }

  .remove-image-btn:hover {
    background: #dc2626;
    transform: scale(1.05);
  }

  .upload-progress {
    margin-top: 12px;
    width: 100%;
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
    overflow: hidden;
  }

  .upload-progress-bar {
    height: 100%;
    background: linear-gradient(135deg, #d97706 0%, #92400e 100%);
    transition: width 0.3s ease;
  }

  /* Loading & Empty States */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #e2e8f0;
    border-top-color: #d97706;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;
    background: white;
    border-radius: 24px;
  }

  .empty-icon {
    font-size: 80px;
    margin-bottom: 20px;
  }

  .empty-title {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .empty-text {
    color: #64748b;
    font-size: 14px;
  }

  /* Modal Footer */
  .modal-footer {
    padding: 20px 28px;
    border-top: 1.5px solid #e2e8f0;
    display: flex;
    gap: 16px;
    justify-content: flex-end;
  }

  .btn-cancel {
    padding: 12px 24px;
    border: none;
    border-radius: 14px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    background: #f1f5f9;
    color: #475569;
    transition: all 0.2s;
  }

  .btn-cancel:hover {
    background: #e2e8f0;
  }

  .btn-submit {
    padding: 12px 24px;
    border: none;
    border-radius: 14px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    background: linear-gradient(135deg, #d97706 0%, #92400e 100%);
    color: white;
    transition: all 0.2s;
  }

  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
  }

  .btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Online Consultation Badge */
  .online-consultation {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .online-symptoms-container {
      padding: 16px;
    }
    .header-title {
      font-size: 24px;
    }
    .stats-grid {
      grid-template-columns: 1fr;
    }
    .symptoms-grid {
      grid-template-columns: 1fr;
    }
    .pagination-container {
      flex-direction: column;
      align-items: center;
    }
    .pagination-controls {
      justify-content: center;
    }
  }
`;

export default function OnlineSymptoms() {
  const [symptoms, setSymptoms] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    color: '#d97706',
    doctors: []
  });

  const colorPresets = [
    '#d97706', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316'
  ];

  useEffect(() => {
    fetchSymptoms();
    fetchDoctors();
  }, [currentPage, itemsPerPage, searchTerm]);

  const fetchSymptoms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`);
      setSymptoms(response.data.data);
      setTotalItems(response.data.total);
      setTotalPages(response.data.totalPages);
      setHasNextPage(response.data.hasNextPage);
      setHasPrevPage(response.data.hasPrevPage);
    } catch (error) {
      toast.error('Failed to fetch online symptoms');
      console.error(error);
    }
    setLoading(false);
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(DOCTOR_API);
      setDoctors(response.data.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleImageChange = (file) => {
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }
    
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Symptom name is required');
      return;
    }

    if (!imageFile && !editingSymptom) {
      toast.error('Please select an image for the symptom');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('color', formData.color);
    formData.doctors.forEach(doctorId => {
      submitData.append('doctors', doctorId);
    });
    
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      let response;
      if (editingSymptom) {
        response = await axios.put(`${API}/${editingSymptom._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        });
        toast.success('Online symptom updated successfully!');
      } else {
        response = await axios.post(API, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        });
        toast.success('Online symptom created successfully!');
      }
      
      if (response.data.success) {
        setShowModal(false);
        resetForm();
        fetchSymptoms();
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to save online symptom');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this online symptom?')) {
      try {
        await axios.delete(`${API}/${id}`);
        toast.success('Online symptom deleted successfully');
        fetchSymptoms();
      } catch (error) {
        toast.error('Failed to delete online symptom');
        console.error(error);
      }
    }
  };

  const handleEdit = (symptom) => {
    setEditingSymptom(symptom);
    setFormData({
      name: symptom.name,
      color: symptom.color || '#d97706',
      doctors: symptom.doctors?.map(d => d._id || d) || []
    });
    setImagePreview(symptom.image?.url);
    setImageFile(null);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingSymptom(null);
    setFormData({
      name: '',
      color: '#d97706',
      doctors: []
    });
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(0);
  };

  const handleDoctorChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setFormData({ ...formData, doctors: selectedValues });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const totalSymptoms = totalItems;
  const symptomsWithDoctors = symptoms.filter(s => s.doctors?.length > 0).length;

  return (
    <>
      <style>{styles}</style>
      <div className="online-symptoms-container">
        {/* Header */}
        <div className="header-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div className="online-consultation" style={{ marginBottom: '12px' }}>
                🟢 Online Consultation Available
              </div>
              <h1 className="header-title">Online Symptom Management</h1>
              <p className="header-subtitle">Manage symptoms for online consultation and associate with doctors</p>
            </div>
            <button className="add-symptom-btn" onClick={() => setShowModal(true)}>
              <span>+</span> Add Online Symptom
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>🩺</div>
            </div>
            <div className="stat-value">{totalSymptoms}</div>
            <div className="stat-label">Total Online Symptoms</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}>👨‍⚕️</div>
            </div>
            <div className="stat-value">{doctors.length}</div>
            <div className="stat-label">Available Doctors</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>🔗</div>
            </div>
            <div className="stat-value">{symptomsWithDoctors}</div>
            <div className="stat-label">Symptoms with Doctors</div>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-wrapper">
            <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search online symptoms by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Symptoms Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p style={{ marginTop: '16px', color: '#64748b' }}>Loading online symptoms...</p>
          </div>
        ) : symptoms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🩺</div>
            <h3 className="empty-title">No online symptoms found</h3>
            <p className="empty-text">Click "Add Online Symptom" to get started</p>
          </div>
        ) : (
          <>
            <div className="symptoms-grid">
              {symptoms.map((symptom) => (
                <div key={symptom._id} className="symptom-card">
                  <div className="card-image-wrapper">
                    {symptom.image?.url && !symptom.image.url.includes('placeholder') ? (
                      <img src={symptom.image.url} alt={symptom.name} className="symptom-image" />
                    ) : (
                      <div className="image-placeholder">
                        <span style={{ fontSize: '64px' }}>🩺</span>
                      </div>
                    )}
                    <div className="online-badge">
                      <span>🟢</span> Online
                    </div>
                    <div className="color-badge" style={{ backgroundColor: symptom.color || '#d97706' }}></div>
                  </div>

                  <div className="card-content">
                    <h3 className="symptom-name">{symptom.name}</h3>
                    
                    {symptom.doctors && symptom.doctors.length > 0 ? (
                      <div className="doctors-section">
                        <div className="doctors-label">Associated Doctors (Online Available)</div>
                        <div className="doctors-list">
                          {symptom.doctors.slice(0, 3).map((doctor) => (
                            <span key={doctor._id} className="doctor-tag">
                              👨‍⚕️ {doctor.name}
                            </span>
                          ))}
                          {symptom.doctors.length > 3 && (
                            <span className="doctor-tag">
                              +{symptom.doctors.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="doctors-section">
                        <div className="doctors-label">No Doctors Associated</div>
                      </div>
                    )}

                    <div className="card-actions">
                      <button className="edit-btn" onClick={() => handleEdit(symptom)}>
                        ✏️ Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(symptom._id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-section">
                <div className="pagination-container">
                  <div className="pagination-info">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} online symptoms
                  </div>
                  
                  <div className="pagination-controls">
                    <button
                      className="page-btn"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      « First
                    </button>
                    <button
                      className="page-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ‹ Previous
                    </button>
                    
                    <div className="page-numbers">
                      {getPageNumbers().map(page => (
                        <button
                          key={page}
                          className={`page-btn ${currentPage === page ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      className="page-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next ›
                    </button>
                    <button
                      className="page-btn"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      Last »
                    </button>
                  </div>
                  
                  <div>
                    <select className="per-page-select" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                      <option value={6}>6 per page</option>
                      <option value={9}>9 per page</option>
                      <option value={12}>12 per page</option>
                      <option value={15}>15 per page</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modal for Create/Edit */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{editingSymptom ? 'Edit Online Symptom' : 'Add New Online Symptom'}</h2>
                <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Symptom Name <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Fever, Headache, Cough (Online Consultation)"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Color Theme</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      {colorPresets.map((color) => (
                        <button
                          key={color}
                          type="button"
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: color,
                            border: formData.color === color ? '3px solid #1e293b' : '2px solid white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            transform: formData.color === color ? 'scale(1.1)' : 'scale(1)'
                          }}
                          onClick={() => setFormData({ ...formData, color })}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      className="form-input"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Symptom Image <span className="required">*</span></label>
                    <div
                      className={`upload-area ${dragOver ? 'drag-over' : ''}`}
                      onClick={() => document.getElementById('imageInput').click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="preview-image" />
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageFile(null);
                              setImagePreview(null);
                            }}
                          >
                            Remove Image
                          </button>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📷</div>
                          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>
                            Click or drag & drop to upload
                          </p>
                          <p style={{ color: '#94a3b8', fontSize: '12px' }}>
                            PNG, JPG, GIF, WEBP up to 2MB
                          </p>
                        </>
                      )}
                      <input
                        id="imageInput"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageChange(e.target.files[0])}
                        required={!editingSymptom}
                      />
                    </div>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="upload-progress">
                        <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Associate Doctors (For Online Consultation)</label>
                    <select
                      multiple
                      className="form-select"
                      value={formData.doctors}
                      onChange={handleDoctorChange}
                      size={6}
                    >
                      {doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          👨‍⚕️ {doctor.name} - {doctor.speciality || 'General Physician'} (Online Available)
                        </option>
                      ))}
                    </select>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                      💡 Hold Ctrl/Cmd to select multiple doctors for online consultation
                    </p>
                    {formData.doctors.length > 0 && (
                      <div className="doctors-list" style={{ marginTop: '12px' }}>
                        {formData.doctors.map((doctorId) => {
                          const doctor = doctors.find(d => d._id === doctorId);
                          return doctor ? (
                            <span key={doctorId} className="doctor-tag">
                              {doctor.name}
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    doctors: formData.doctors.filter(id => id !== doctorId)
                                  });
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  marginLeft: '6px',
                                  color: '#ef4444'
                                }}
                              >
                                ×
                              </button>
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner" style={{ width: '16px', height: '16px', display: 'inline-block', marginRight: '8px' }}></span>
                        {editingSymptom ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingSymptom ? 'Update Online Symptom' : 'Create Online Symptom'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}