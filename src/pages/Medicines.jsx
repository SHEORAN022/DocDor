import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'https://userside-x164.onrender.com/api/medicines';
const SUBCATEGORY_API = 'https://userside-x164.onrender.com/api/subcategories';
const MEDICINE_ITEM_API = 'https://userside-x164.onrender.com/api/medicineItem';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .medicines-container {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
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
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
  }

  .header-subtitle {
    color: #1e3a8a;
    font-size: 14px;
    font-weight: 500;
  }

  .add-medicine-btn {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
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
    box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
  }

  .add-medicine-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
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
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
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

  .filter-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .filter-label {
    font-size: 13px;
    font-weight: 600;
    color: #334155;
  }

  .filter-select {
    flex: 1;
    min-width: 250px;
    padding: 10px 14px;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    background: #f8fafc;
    cursor: pointer;
  }

  .filter-select:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .clear-filter-btn {
    padding: 10px 16px;
    background: #f1f5f9;
    border: none;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    color: #64748b;
    transition: all 0.2s;
  }

  .clear-filter-btn:hover {
    background: #e2e8f0;
    color: #1e293b;
  }

  /* Medicines Grid */
  .medicines-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  /* Medicine Card */
  .medicine-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    border: 1px solid rgba(226, 232, 240, 0.8);
  }

  .medicine-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px -12px rgba(0,0,0,0.15);
  }

  .card-image-wrapper {
    position: relative;
    height: 200px;
    overflow: hidden;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    cursor: pointer;
  }

  .medicine-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .medicine-card:hover .medicine-image {
    transform: scale(1.1);
  }

  .image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }

  .category-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    padding: 6px 12px;
    border-radius: 20px;
    color: white;
    font-size: 11px;
    font-weight: 500;
  }

  .items-count {
    position: absolute;
    bottom: 16px;
    left: 16px;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    padding: 4px 12px;
    border-radius: 20px;
    color: #fbbf24;
    font-size: 12px;
    font-weight: 600;
  }

  .card-content {
    padding: 20px;
  }

  .medicine-name {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 12px;
    line-height: 1.3;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #e2e8f0;
  }

  .info-label {
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
  }

  .info-value {
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
    background: #f1f5f9;
    padding: 4px 10px;
    border-radius: 8px;
  }

  .medicine-items-list {
    margin-top: 12px;
  }

  .items-label {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .items-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .item-tag {
    background: #dbeafe;
    color: #1e40af;
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
    max-width: 700px;
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
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
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

  .form-input:focus, .form-select:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  /* Multi-select styles */
  .multi-select-container {
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    background: #f8fafc;
    overflow: hidden;
  }

  .multi-select-header {
    padding: 12px 16px;
    background: #f8fafc;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
  }

  .multi-select-header:hover {
    background: #f1f5f9;
  }

  .selected-count {
    font-size: 13px;
    color: #3b82f6;
    font-weight: 500;
  }

  .multi-select-dropdown {
    max-height: 200px;
    overflow-y: auto;
    border-top: 1px solid #e2e8f0;
  }

  .multi-select-option {
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .multi-select-option:hover {
    background: #f1f5f9;
  }

  .multi-select-option input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  .multi-select-option label {
    flex: 1;
    cursor: pointer;
    font-size: 13px;
    color: #334155;
  }

  .selected-items {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 12px;
  }

  .selected-item-badge {
    background: #dbeafe;
    color: #1e40af;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .remove-item {
    cursor: pointer;
    font-weight: bold;
    color: #ef4444;
  }

  .remove-item:hover {
    color: #dc2626;
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
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .upload-area.drag-over {
    border-color: #3b82f6;
    background: #dbeafe;
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
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
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
    border-top-color: #3b82f6;
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
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white;
    transition: all 0.2s;
  }

  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  .btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Image Modal */
  .image-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1100;
    cursor: pointer;
  }

  .full-image {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .medicines-container {
      padding: 16px;
    }
    .header-title {
      font-size: 24px;
    }
    .stats-grid {
      grid-template-columns: 1fr;
    }
    .medicines-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [medicineItems, setMedicineItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [showItemsDropdown, setShowItemsDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    subCategory: '',
    medicineItems: []
  });

  useEffect(() => {
    fetchMedicines();
    fetchSubCategories();
    fetchMedicineItems();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API);
      setMedicines(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch medicines');
      console.error(error);
    }
    setLoading(false);
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(SUBCATEGORY_API);
      setSubCategories(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchMedicineItems = async () => {
    try {
      const response = await axios.get(MEDICINE_ITEM_API);
      setMedicineItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching medicine items:', error);
    }
  };

  const handleImageChange = (file) => {
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
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

  const handleItemToggle = (itemId) => {
    setFormData(prev => {
      const currentItems = prev.medicineItems;
      if (currentItems.includes(itemId)) {
        return { ...prev, medicineItems: currentItems.filter(id => id !== itemId) };
      } else {
        return { ...prev, medicineItems: [...currentItems, itemId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Medicine name is required');
      return;
    }

    if (!formData.subCategory) {
      toast.error('Please select a subcategory');
      return;
    }

    if (!imageFile && !editingMedicine) {
      toast.error('Please select an image for the medicine');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('subCategory', formData.subCategory);
    
    formData.medicineItems.forEach(itemId => {
      submitData.append('medicineItems', itemId);
    });
    
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      let response;
      if (editingMedicine) {
        response = await axios.put(`${API}/${editingMedicine._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          }
        });
        toast.success('Medicine updated successfully!');
      } else {
        response = await axios.post(API, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          }
        });
        toast.success('Medicine created successfully!');
      }
      
      if (response.data.success) {
        setShowModal(false);
        resetForm();
        fetchMedicines();
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to save medicine');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine? This will also remove associations with medicine items.')) {
      try {
        await axios.delete(`${API}/${id}`);
        toast.success('Medicine deleted successfully');
        fetchMedicines();
      } catch (error) {
        toast.error('Failed to delete medicine');
        console.error(error);
      }
    }
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      subCategory: medicine.subCategory?._id || medicine.subCategory || '',
      medicineItems: medicine.medicineItems?.map(item => item._id || item) || []
    });
    setImagePreview(medicine.image?.url);
    setImageFile(null);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingMedicine(null);
    setFormData({
      name: '',
      subCategory: '',
      medicineItems: []
    });
    setImageFile(null);
    setImagePreview(null);
    setUploadProgress(0);
    setShowItemsDropdown(false);
  };

  const handleImageClick = (imageUrl) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setShowImageModal(true);
    }
  };

  const getSubCategoryName = (subCategoryId) => {
    const subCat = subCategories.find(c => c._id === subCategoryId);
    return subCat?.name || 'Unknown';
  };

  const getItemName = (itemId) => {
    const item = medicineItems.find(i => i._id === itemId || i.id === itemId);
    return item?.name || 'Unknown Item';
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredByCategory = selectedSubCategory
    ? filteredMedicines.filter(m => (m.subCategory?._id || m.subCategory) === selectedSubCategory)
    : filteredMedicines;

  const totalMedicines = filteredByCategory.length;
  const avgItemsPerMedicine = totalMedicines > 0 
    ? filteredByCategory.reduce((sum, m) => sum + (m.medicineItems?.length || 0), 0) / totalMedicines 
    : 0;

  return (
    <>
      <style>{styles}</style>
      <div className="medicines-container">
        {/* Header */}
        <div className="header-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 className="header-title">Medicine Management</h1>
              <p className="header-subtitle">Manage medicines and associate with medicine items</p>
            </div>
            <button className="add-medicine-btn" onClick={() => setShowModal(true)}>
              <span>+</span> Add New Medicine
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>💊</div>
            </div>
            <div className="stat-value">{totalMedicines}</div>
            <div className="stat-label">Total Medicines</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>📦</div>
            </div>
            <div className="stat-value">{medicineItems.length}</div>
            <div className="stat-label">Available Items</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>📊</div>
            </div>
            <div className="stat-value">{avgItemsPerMedicine.toFixed(1)}</div>
            <div className="stat-label">Avg Items/Medicine</div>
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
              placeholder="Search medicines by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-wrapper">
            <span className="filter-label">Filter by SubCategory:</span>
            <select 
              className="filter-select" 
              value={selectedSubCategory} 
              onChange={(e) => setSelectedSubCategory(e.target.value)}
            >
              <option value="">All SubCategories</option>
              {subCategories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            {selectedSubCategory && (
              <button className="clear-filter-btn" onClick={() => setSelectedSubCategory('')}>
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Medicines Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p style={{ marginTop: '16px', color: '#64748b' }}>Loading medicines...</p>
          </div>
        ) : filteredByCategory.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💊</div>
            <h3 className="empty-title">No medicines found</h3>
            <p className="empty-text">Click "Add New Medicine" to get started</p>
          </div>
        ) : (
          <div className="medicines-grid">
            {filteredByCategory.map((medicine) => (
              <div key={medicine._id} className="medicine-card">
                <div 
                  className="card-image-wrapper"
                  onClick={() => handleImageClick(medicine.image?.url)}
                >
                  {medicine.image?.url ? (
                    <img src={medicine.image.url} alt={medicine.name} className="medicine-image" />
                  ) : (
                    <div className="image-placeholder">
                      <span style={{ fontSize: '64px' }}>💊</span>
                    </div>
                  )}
                  {medicine.subCategory && (
                    <div className="category-badge">
                      {medicine.subCategory.name || getSubCategoryName(medicine.subCategory)}
                    </div>
                  )}
                  <div className="items-count">
                    📦 {medicine.medicineItems?.length || 0} items
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="medicine-name">{medicine.name}</h3>
                  
                  <div className="info-row">
                    <span className="info-label">Created</span>
                    <span className="info-value">
                      {new Date(medicine.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {medicine.medicineItems && medicine.medicineItems.length > 0 && (
                    <div className="medicine-items-list">
                      <div className="items-label">Associated Items</div>
                      <div className="items-tags">
                        {medicine.medicineItems.slice(0, 3).map((item) => (
                          <span key={item._id || item} className="item-tag">
                            💊 {item.name || getItemName(item)}
                          </span>
                        ))}
                        {medicine.medicineItems.length > 3 && (
                          <span className="item-tag">
                            +{medicine.medicineItems.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="card-actions">
                    <button className="edit-btn" onClick={() => handleEdit(medicine)}>
                      ✏️ Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(medicine._id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Create/Edit */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}</h2>
                <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Medicine Name <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Antibiotics, Painkillers, Vitamins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Sub Category <span className="required">*</span></label>
                    <select
                      className="form-select"
                      value={formData.subCategory}
                      onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                      required
                    >
                      <option value="">Select a subcategory</option>
                      {subCategories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          📁 {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Medicine Items</label>
                    <div className="multi-select-container">
                      <div 
                        className="multi-select-header"
                        onClick={() => setShowItemsDropdown(!showItemsDropdown)}
                      >
                        <span>Select medicine items</span>
                        <span className="selected-count">
                          {formData.medicineItems.length} selected
                        </span>
                      </div>
                      {showItemsDropdown && (
                        <div className="multi-select-dropdown">
                          {medicineItems.map((item) => (
                            <div 
                              key={item._id || item.id}
                              className="multi-select-option"
                              onClick={() => handleItemToggle(item._id || item.id)}
                            >
                              <input
                                type="checkbox"
                                checked={formData.medicineItems.includes(item._id || item.id)}
                                onChange={() => {}}
                              />
                              <label>{item.name}</label>
                            </div>
                          ))}
                          {medicineItems.length === 0 && (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                              No medicine items available. Create some first!
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {formData.medicineItems.length > 0 && (
                      <div className="selected-items">
                        {formData.medicineItems.map((itemId) => (
                          <span key={itemId} className="selected-item-badge">
                            💊 {getItemName(itemId)}
                            <span 
                              className="remove-item"
                              onClick={() => handleItemToggle(itemId)}
                            >
                              ×
                            </span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Medicine Image <span className="required">*</span></label>
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
                          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🖼️</div>
                          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>
                            Click or drag & drop to upload
                          </p>
                          <p style={{ color: '#94a3b8', fontSize: '12px' }}>
                            PNG, JPG, GIF, WEBP up to 5MB
                          </p>
                        </>
                      )}
                      <input
                        id="imageInput"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageChange(e.target.files[0])}
                        required={!editingMedicine && !imagePreview}
                      />
                    </div>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="upload-progress">
                        <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }}></div>
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
                        {editingMedicine ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingMedicine ? 'Update Medicine' : 'Create Medicine'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && (
          <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
            <img src={selectedImage} alt="Full view" className="full-image" />
          </div>
        )}
      </div>
    </>
  );
}