// src/utils/imageUpload.js

export const uploadToImgBB = async (file) => {
  const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
  
  if (!API_KEY) {
    throw new Error('ImgBB API key not configured. Add VITE_IMGBB_API_KEY to environment variables.');
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    return {
      url: data.data.url,
      thumb: data.data.thumb.url,
      delete_url: data.data.delete_url,
      filename: data.data.image.filename
    };
  } catch (error) {
    console.error('ImgBB upload error:', error);
    throw error;
  }
};

export const validateImage = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPG, PNG, GIF, and WEBP images are allowed');
  }
  
  if (file.size > maxSize) {
    throw new Error('Image must be less than 5MB');
  }
  
  return true;
};
