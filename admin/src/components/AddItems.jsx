import React, { useState } from 'react';
import { styles } from './../assets/dummyData';
import { FiUpload, FiHeart, FiStar, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import axios from 'axios';

const AddItems = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    category: '',
    rating: 0,
    hearts: 0,
    preview: '',
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [errors, setErrors] = useState({});

  const [categories] = useState([
    'Breakfast', 'Lunch', 'Dinner',
    'Mexican', 'Desserts', 'Italian', 'Drinks',
  ]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.image) {
      newErrors.image = 'Product image is required';
    }
    
    if (formData.rating === 0) {
      newErrors.rating = 'Please provide a rating';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'hearts' || name === 'rating' || name === 'price'
        ? Number(value) || 0
        : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }));
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }));
        return;
      }
      
      setFormData((prev) => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file),
      }));
      
      // Clear image error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const handleRating = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
    
    // Clear rating error
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }
  };

  const handleHearts = () => {
    setFormData((prev) => ({
      ...prev,
      hearts: prev.hearts + 1,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: null,
      category: '',
      rating: 0,
      hearts: 0,
      preview: '',
    });
    setErrors({});
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key !== 'preview' && val !== null && val !== '') {
          payload.append(key, val);
        }
      });

      const res = await axios.post('https://the-food-app-backend.onrender.com/api/items',
  payload,
  {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true, // ✅ Important!
  });
      console.log('Item added:', res.data);
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        resetForm();
        setSubmitStatus(null);
      }, 2000);
      
    } catch (error) {
      console.error('Error adding item:', error);
      setSubmitStatus('error');
      
      // Set specific error message if available
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: 'Failed to add item. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClassName = (fieldName) => {
    return `${styles.inputField} ${errors[fieldName] ? 'border-red-500' : ''}`;
  };

  const StatusMessage = () => {
    if (submitStatus === 'success') {
      return (
        <div className="flex items-center gap-2 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
          <FiCheck className="text-xl" />
          <span>Item added successfully!</span>
        </div>
      );
    }
    
    if (submitStatus === 'error' && errors.submit) {
      return (
        <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
          <FiX className="text-xl" />
          <span>{errors.submit}</span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={styles.formWrapper}>
      <div className="max-w-4xl mx-auto">
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Add New Menu Item</h2>
          
          <StatusMessage />
          
          <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
            
            {/* Upload */}
            <div className={styles.uploadWrapper}>
              <label className={styles.uploadLabel}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  hidden
                />
                {formData.preview ? (
                  <img
                    src={formData.preview}
                    className={styles.previewImage}
                    alt="Preview"
                  />
                ) : (
                  <div className="text-center p-4">
                    <FiUpload className={styles.uploadIcon} />
                    <p className={styles.uploadText}>
                      Click to Upload Product Image
                    </p>
                  </div>
                )}
              </label>
              {errors.image && (
                <p className="text-red-400 text-sm mt-2">{errors.image}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className='block mb-2 text-base sm:text-lg text-amber-400'>
                Product Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={getInputClassName('name')}
                placeholder="Name"
                type='text'
                required
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className='block mb-2 text-base sm:text-lg text-amber-400'>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={getInputClassName('description')}
                placeholder="Description"
                rows="4"
                required
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className='block mb-2 text-base sm:text-lg text-amber-400'>
                Price (₹)
              </label>
              <input
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={getInputClassName('price')}
                placeholder="Price"
                type="number"
                min="0"
                step="0.01"
                required
              />
              {errors.price && (
                <p className="text-red-400 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className='block mb-2 text-base sm:text-lg text-amber-400'>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={getInputClassName('category')}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-400 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className='block mb-2 text-base sm:text-lg text-amber-400'>
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type='button'
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className='text-2xl sm:text-3xl transition-transform hover:scale-110'
                  >
                    <FiStar className={
                      star <= (hoverRating || formData.rating)
                        ? 'text-amber-400 fill-current'
                        : 'text-amber-100/30'
                    } />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-red-400 text-sm mt-1">{errors.rating}</p>
              )}
            </div>

            {/* Hearts */}
            <div>
              <label className='block mb-2 text-base sm:text-lg text-amber-400'>
                Popularity
              </label>
              <div className='flex items-center gap-3 sm:gap-4'>
                <button
                  type='button'
                  onClick={handleHearts}
                  className='text-2xl sm:text-3xl text-amber-400 hover:text-amber-300 transition-colors animate-pulse'
                >
                  <FiHeart />
                </button>

                <input
                  type='number'
                  name='hearts'
                  value={formData.hearts}
                  onChange={handleInputChange}
                  className={`${styles.inputField} pl-10 sm:pl-12`}
                  placeholder='Enter Likes'
                  min='0'
                />
              </div>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              className={`${styles.actionBtn} ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <FiLoader className="animate-spin" />
                  <span>Adding Item...</span>
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItems;