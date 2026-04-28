import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

// Make sure to default images to an empty array to prevent undefined errors
const MultiImageUploader = ({ images = [], setImages }) => {
  const MIN_FILES = 2;
  const MAX_FILES = 5;
  const MIN_SIZE_BYTES = 60 * 1024;
  const MAX_SIZE_BYTES = 6 * 1024 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  // Safely cleanup Blob URLs (avoids revoking real Supabase URLs)
  useEffect(() => {
    return () => {
      images.forEach((item) => {
        if (item.file && item.preview.startsWith('blob:')) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, [images]);

  const handleFileChange = (event) => {
    setErrorMessage('');
    const newFilesList = Array.from(event.target.files);

    if (images.length + newFilesList.length > MAX_FILES) {
      setErrorMessage(`Limit exceeded: You can only upload up to ${MAX_FILES} images.`);
      return;
    }

    const validFiles = [];
    newFilesList.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrorMessage('Only JPG and PNG files are allowed.');
      } else if (file.size < MIN_SIZE_BYTES || file.size > MAX_SIZE_BYTES) {
        setErrorMessage('Images must be between 60KB and 6MB.');
      } else {
        // We store an object with BOTH the raw file (for uploading) and the preview URL
        validFiles.push({ file, preview: URL.createObjectURL(file) });
      }
    });

    if (validFiles.length > 0) {
      // Send the new images directly up to MakePost!
      setImages((prev) => [...prev, ...validFiles]);
    }

    // Clear the input so the user can upload the exact same file again if they accidentally delete it
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (indexToRemove) => {
    // Tell MakePost to remove this image from its state
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const isRequirementMet = images.length >= MIN_FILES && images.length <= MAX_FILES;

  return (
    <div className="max-w-[600px] mx-auto my-5 space-y-4">
      {errorMessage && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex items-center gap-2 text-amber-800">
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div
        onClick={() => fileInputRef.current.click()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all
          ${isRequirementMet ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-green-600'}`}
      >
        <UploadCloud className="mx-auto text-gray-400 mb-2" size={48} />
        <h6 className="text-lg font-semibold text-gray-900">Click to upload images</h6>
        <p className="text-sm text-gray-500">Min {MIN_FILES}, Max {MAX_FILES} (JPG/PNG, 60KB - 6MB)</p>
      </div>

      <div className="flex items-center gap-2">
        <p className={`text-sm font-medium ${isRequirementMet ? 'text-green-600' : 'text-gray-500'}`}>
          Selected: {images.length} images. {!isRequirementMet && `(Need ${Math.max(0, MIN_FILES - images.length)} more)`}
        </p>
        {isRequirementMet && <CheckCircle size={16} className="text-green-600" />}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((item, index) => (
          <div key={item.preview || index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
            <img src={item.preview} alt={`preview-${index}`} className="w-full h-full object-cover" />
            <button
              type="button" // Prevents the form from accidentally submitting when clicking delete
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage(index);
              }}
              className="absolute top-1 right-1 p-1.5 bg-white/80 rounded-full hover:bg-white text-gray-600 hover:text-red-600 shadow-sm"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <input type="file" className="hidden" accept="image/png, image/jpeg" multiple ref={fileInputRef} onChange={handleFileChange} />
    </div>
  );
};

export default MultiImageUploader;