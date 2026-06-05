import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'https://userside-x164.onrender.com/api/surgeries';
const DOCTOR_API = 'https://userside-x164.onrender.com/api/doctors';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .surgeries-container {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
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
    background: linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
  }

  .header-subtitle {
    color: #991b1b;
    font-size: 14px;
    font-weight: 500;
  }

  .add-surgery-btn {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
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
    box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.2);
  }

  .add-surgery-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.3);
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
    border-color: #dc2626;
    background: white;
    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
  }

  /* Filter Section */
  .filter-section {
    background: white;
    border-radius: 20px;
    padding: 20px 24px;
    margin-bottom: 32px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border: 1px solid rgba(226, 232, 240, 0.8);
  }

  .filter-title {
    font-size: 13px;
    font-weight: 600;
    color: #334155;
    margin-bottom: 12px;
  }

  .filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .filter-btn {
    padding: 8px 16px;
    border: 1.5px solid #e2e8f0;
    background: white;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    color: #475569;
  }

  .filter-btn:hover {
    border-color: #dc2626;
    color: #dc2626;
  }

  .filter-btn.active {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    color: white;
    border-color: #dc2626;
  }

  /* Surgeries Grid */
  .surgeries-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  /* Surgery Card */
  .surgery-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    border: 1px solid rgba(226, 232, 240, 0.8);
  }

  .surgery-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -12px rgba(0,0,0,0.15);
  }

  .card-icon-wrapper {
    position: relative;
    height: 160px;
    overflow: hidden;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .surgery-icon {
    width: 80px;
    height: 80px;
    object-fit: contain;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
  }

  .icon-placeholder {
    font-size: 64px;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
  }

  .category-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(8px);
    padding: 4px 12px;
    border-radius: 20px;
    color: white;
    font-size: 11px;
    font-weight: 600;
  }

  .duration-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(8px);
    padding: 4px 12px;
    border-radius: 20px;
    color: #fbbf24;
    font-size: 11px;
    font-weight: 600;
  }

  .card-content {
    padding: 20px;
  }

  .surgery-name {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 12px;
    line-height: 1.3;
  }

  .price-range {
    display: inline-block;
    background: #fef3c7;
    color: #d97706;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 16px;
  }

  .benefits-section {
    margin-bottom: 16px;
  }

  .benefits-label {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .benefits-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .benefit-tag {
    background: #f1f5f9;
    color: #475569;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 500;
  }

  .doctors-section {
    margin-bottom: 16px;
  }

  .doctors-label {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .doctors-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .doctor-tag {
    background: #fef2f2;
    color: #dc2626;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .card-actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;
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
    font-size: 13px;
    font-weight: 500;
  }

  .pagination-controls {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  .page-btn {
    min-width: 38px;
    height: 38px;
    padding: 0 10px;
    border: 1.5px solid #e2e8f0;
    background: white;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    transition: all 0.2s;
    color: #475569;
  }

  .page-btn:hover:not(:disabled) {
    background: #f1f5f9;
    border-color: #dc2626;
    color: #dc2626;
  }

  .page-btn.active {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    color: white;
    border-color: #dc2626;
  }

  .page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .page-numbers {
    display: flex;
    gap: 6px;
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
    max-width: 680px;
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
    background: linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%);
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

  .form-input, .form-select, .form-textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
    background: #f8fafc;
  }

  .form-textarea {
    resize: vertical;
    min-height: 80px;
  }

  .form-input:focus, .form-select:focus, .form-textarea:focus {
    outline: none;
    border-color: #dc2626;
    background: white;
    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
  }

  /* Benefits Input */
  .benefits-input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 12px;
  }

  .benefits-input {
    flex: 1;
    padding: 10px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    font-size: 13px;
  }

  .add-benefit-btn {
    padding: 10px 20px;
    background: #dc2626;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 500;
  }

  /* Icon Upload Area */
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
    border-color: #dc2626;
    background: #fef2f2;
  }

  .upload-area.drag-over {
    border-color: #dc2626;
    background: #fee2e2;
  }

  .preview-icon {
    max-width: 100px;
    max-height: 100px;
    object-fit: contain;
    margin-bottom: 16px;
  }

  .remove-icon-btn {
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

  .remove-icon-btn:hover {
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
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
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
    border-top-color: #dc2626;
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
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    color: white;
    transition: all 0.2s;
  }

  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  }

  .btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .surgeries-container {
      padding: 16px;
    }
    .header-title {
      font-size: 24px;
    }
    .stats-grid {
      grid-template-columns: 1fr;
    }
    .surgeries-grid {
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

export default function Surgeries() {
  const [surgeries, setSurgeries] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSurgery, setEditingSurgery] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [benefitInput, setBenefitInput] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    duration: '',
    benefits: [],
    priceRange: '',
    doctors: []
  });

  const categories = [
    'Cardiac Surgery',
    'Neurosurgery',
    'Orthopedic Surgery',
    'Plastic Surgery',
    'General Surgery',
    'Pediatric Surgery',
    'Oncology Surgery',
    'Transplant Surgery',
    'Vascular Surgery',
    'Ophthalmology Surgery',
    'ENT Surgery',
    'Urology Surgery',
    'Gynecology Surgery',
    'Dental Surgery',
    'Bariatric Surgery'
  ];

  const durations = [
    '30-60 minutes',
    '1-2 hours',
    '2-3 hours',
    '3-4 hours',
    '4-5 hours',
    '5-6 hours',
    '6-8 hours',
    '8+ hours'
  ];

  useEffect(() => {
    fetchSurgeries();
    fetchDoctors();
  }, [currentPage, itemsPerPage, searchTerm, selectedCategory]);

  const fetchSurgeries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`);
      let filteredData = response.data.data;
      
      if (selectedCategory !== 'all') {
        filteredData = filteredData.filter(surgery => surgery.category === selectedCategory);
      }
      
      setSurgeries(filteredData);
      setTotalItems(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch surgeries');
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

  const handleIconChange = (file) => {
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, WEBP, SVG)');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Icon size should be less than 2MB');
      return;
    }
    
    setIconFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setIconPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim()) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, benefitInput.trim()]
      });
      setBenefitInput('');
    }
  };

  const handleRemoveBenefit = (index) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index)
    });
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
    handleIconChange(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Surgery name is required');
      return;
    }
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }
    if (!formData.duration) {
      toast.error('Duration is required');
      return;
    }
    if (!iconFile && !editingSurgery) {
      toast.error('Please select an icon for the surgery');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('category', formData.category);
    submitData.append('duration', formData.duration);
    submitData.append('priceRange', formData.priceRange || '');
    formData.benefits.forEach(benefit => {
      submitData.append('benefits', benefit);
    });
    formData.doctors.forEach(doctorId => {
      submitData.append('doctors', doctorId);
    });
    
    if (iconFile) {
      submitData.append('icon', iconFile);
    }

    try {
      let response;
      if (editingSurgery) {
        response = await axios.put(`${API}/${editingSurgery._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        });
        toast.success('Surgery updated successfully!');
      } else {
        response = await axios.post(API, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        });
        toast.success('Surgery added successfully!');
      }
      
      if (response.data.success) {
        setShowModal(false);
        resetForm();
        fetchSurgeries();
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to save surgery');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this surgery?')) {
      try {
        await axios.delete(`${API}/${id}`);
        toast.success('Surgery deleted successfully');
        fetchSurgeries();
      } catch (error) {
        toast.error('Failed to delete surgery');
        console.error(error);
      }
    }
  };

  const handleEdit = (surgery) => {
    setEditingSurgery(surgery);
    setFormData({
      name: surgery.name,
      category: surgery.category,
      duration: surgery.duration,
      benefits: surgery.benefits || [],
      priceRange: surgery.priceRange || '',
      doctors: surgery.doctors?.map(d => d._id || d) || []
    });
    setIconPreview(surgery.icon?.url);
    setIconFile(null);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingSurgery(null);
    setFormData({
      name: '',
      category: '',
      duration: '',
      benefits: [],
      priceRange: '',
      doctors: []
    });
    setIconFile(null);
    setIconPreview(null);
    setUploadProgress(0);
    setBenefitInput('');
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

  const totalSurgeries = surgeries.length;
  const categoriesCount = [...new Set(surgeries.map(s => s.category))].length;

  return (
    <>
      <style>{styles}</style>
      <div className="surgeries-container">
        {/* Header */}
        <div className="header-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 className="header-title">Surgery Management</h1>
              <p className="header-subtitle">Manage surgical procedures, benefits and associated doctors</p>
            </div>
            <button className="add-surgery-btn" onClick={() => setShowModal(true)}>
              <span>+</span> Add New Surgery
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#fef2f2', color: '#dc2626' }}>🔪</div>
            </div>
            <div className="stat-value">{totalSurgeries}</div>
            <div className="stat-label">Total Surgeries</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#fef2f2', color: '#dc2626' }}>📋</div>
            </div>
            <div className="stat-value">{categoriesCount}</div>
            <div className="stat-label">Categories</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#fef2f2', color: '#dc2626' }}>👨‍⚕️</div>
            </div>
            <div className="stat-value">{doctors.length}</div>
            <div className="stat-label">Specialized Doctors</div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="search-section">
          <div className="search-wrapper">
            <svg className="search-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search surgeries by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-title">Filter by Category</div>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Surgeries Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p style={{ marginTop: '16px', color: '#64748b' }}>Loading surgeries...</p>
          </div>
        ) : surgeries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔪</div>
            <h3 className="empty-title">No surgeries found</h3>
            <p className="empty-text">Click "Add New Surgery" to get started</p>
          </div>
        ) : (
          <>
            <div className="surgeries-grid">
              {surgeries.map((surgery) => (
                <div key={surgery._id} className="surgery-card">
                  <div className="card-icon-wrapper">
                    {surgery.icon?.url && !surgery.icon.url.includes('placeholder') ? (
                      <img src={surgery.icon.url} alt={surgery.name} className="surgery-icon" />
                    ) : (
                      <div className="icon-placeholder">🔪</div>
                    )}
                    <div className="category-badge">{surgery.category}</div>
                    <div className="duration-badge">⏱️ {surgery.duration}</div>
                  </div>

                  <div className="card-content">
                    <h3 className="surgery-name">{surgery.name}</h3>
                    {surgery.priceRange && (
                      <div className="price-range">💰 {surgery.priceRange}</div>
                    )}
                    
                    {surgery.benefits && surgery.benefits.length > 0 && (
                      <div className="benefits-section">
                        <div className="benefits-label">✨ Benefits & Highlights</div>
                        <div className="benefits-list">
                          {surgery.benefits.slice(0, 3).map((benefit, idx) => (
                            <span key={idx} className="benefit-tag">{benefit}</span>
                          ))}
                          {surgery.benefits.length > 3 && (
                            <span className="benefit-tag">+{surgery.benefits.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    
                    {surgery.doctors && surgery.doctors.length > 0 ? (
                      <div className="doctors-section">
                        <div className="doctors-label">👨‍⚕️ Specialized Surgeons</div>
                        <div className="doctors-list">
                          {surgery.doctors.slice(0, 2).map((doctor) => (
                            <span key={doctor._id} className="doctor-tag">
                              👨‍⚕️ {doctor.name}
                            </span>
                          ))}
                          {surgery.doctors.length > 2 && (
                            <span className="doctor-tag">
                              +{surgery.doctors.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="doctors-section">
                        <div className="doctors-label">No Surgeons Associated</div>
                      </div>
                    )}

                    <div className="card-actions">
                      <button className="edit-btn" onClick={() => handleEdit(surgery)}>
                        ✏️ Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(surgery._id)}>
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
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} surgeries
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
                <h2 className="modal-title">{editingSurgery ? 'Edit Surgery' : 'Add New Surgery'}</h2>
                <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Surgery Name <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Laparoscopic Cholecystectomy, Knee Replacement"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category <span className="required">*</span></label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Duration <span className="required">*</span></label>
                    <select
                      className="form-select"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                    >
                      <option value="">Select Duration</option>
                      {durations.map(dur => (
                        <option key={dur} value={dur}>{dur}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price Range</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., ₹50,000 - ₹1,50,000"
                      value={formData.priceRange}
                      onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Benefits & Highlights</label>
                    <div className="benefits-input-group">
                      <input
                        type="text"
                        className="benefits-input"
                        placeholder="Enter a benefit (e.g., Minimally Invasive)"
                        value={benefitInput}
                        onChange={(e) => setBenefitInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                      />
                      <button type="button" className="add-benefit-btn" onClick={handleAddBenefit}>
                        Add
                      </button>
                    </div>
                    <div className="benefits-list" style={{ marginTop: '12px' }}>
                      {formData.benefits.map((benefit, idx) => (
                        <span key={idx} className="benefit-tag">
                          {benefit}
                          <button
                            type="button"
                            onClick={() => handleRemoveBenefit(idx)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              marginLeft: '6px',
                              color: '#dc2626',
                              fontWeight: 'bold'
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Surgery Icon <span className="required">*</span></label>
                    <div
                      className={`upload-area ${dragOver ? 'drag-over' : ''}`}
                      onClick={() => document.getElementById('iconInput').click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {iconPreview ? (
                        <>
                          <img src={iconPreview} alt="Preview" className="preview-icon" />
                          <button
                            type="button"
                            className="remove-icon-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIconFile(null);
                              setIconPreview(null);
                            }}
                          >
                            Remove Icon
                          </button>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔪</div>
                          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>
                            Click or drag & drop to upload icon
                          </p>
                          <p style={{ color: '#94a3b8', fontSize: '12px' }}>
                            PNG, JPG, SVG, WEBP up to 2MB
                          </p>
                        </>
                      )}
                      <input
                        id="iconInput"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                        style={{ display: 'none' }}
                        onChange={(e) => handleIconChange(e.target.files[0])}
                        required={!editingSurgery}
                      />
                    </div>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="upload-progress">
                        <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Specialized Surgeons</label>
                    <select
                      multiple
                      className="form-select"
                      value={formData.doctors}
                      onChange={handleDoctorChange}
                      size={6}
                    >
                      {doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          👨‍⚕️ {doctor.name} - {doctor.speciality || 'Surgeon'}
                        </option>
                      ))}
                    </select>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                      💡 Hold Ctrl/Cmd to select multiple surgeons
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
                        {editingSurgery ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingSurgery ? 'Update Surgery' : 'Create Surgery'
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