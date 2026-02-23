import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const MultiImageUploader = () => {
  const MIN_FILES = 2;
  const MAX_FILES = 8;
  const MIN_SIZE_BYTES = 60 * 1024;
  const MAX_SIZE_BYTES = 2 * 1024 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

  const [files, setFiles] = useState([]); 
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => files.forEach((item) => URL.revokeObjectURL(item.preview));
  }, [files]);

  const handleFileChange = (event) => {
    setErrorMessage('');
    const newFilesList = Array.from(event.target.files);
    
    if (files.length + newFilesList.length > MAX_FILES) {
      setErrorMessage(`Limit exceeded: You can only upload up to ${MAX_FILES} images.`);
      return;
    }

    const validFiles = [];
    newFilesList.forEach((file) => {
      if (ALLOWED_TYPES.includes(file.type) && file.size >= MIN_SIZE_BYTES && file.size <= MAX_SIZE_BYTES) {
        validFiles.push({ file, preview: URL.createObjectURL(file) });
      }
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const isRequirementMet = files.length >= MIN_FILES && files.length <= MAX_FILES;

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
        <p className="text-sm text-gray-500">Min {MIN_FILES}, Max {MAX_FILES} (JPG/PNG, 60KB - 2MB)</p>
      </div>

      <div className="flex items-center gap-2">
        <p className={`text-sm font-medium ${isRequirementMet ? 'text-green-600' : 'text-gray-500'}`}>
          Selected: {files.length} images. {!isRequirementMet && `(Need ${Math.max(0, MIN_FILES - files.length)} more)`}
        </p>
        {isRequirementMet && <CheckCircle size={16} className="text-green-600" />}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {files.map((item, index) => (
          <div key={item.preview} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
            <img src={item.preview} alt={`preview-${index}`} className="w-full h-full object-cover" />
            <button 
              onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
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