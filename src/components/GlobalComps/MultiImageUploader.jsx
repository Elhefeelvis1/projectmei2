import React, { useRef, useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  IconButton, 
  Alert, 
  Stack 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const MultiImageUploader = () => {
  // --- Constants ---
  const MIN_FILES = 2;
  const MAX_FILES = 8;
  const MIN_SIZE_BYTES = 60 * 1024; // 60KB
  const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

  // --- State ---
  // We store objects: { file: File, preview: String (URL) }
  const [files, setFiles] = useState([]); 
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);

  // --- Cleanup Effect ---
  // Revoke URLs when the component unmounts to avoid memory leaks
  useEffect(() => {
    return () => {
      files.forEach((item) => URL.revokeObjectURL(item.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Handlers ---
  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setErrorMessage('');
    const newFilesList = Array.from(event.target.files);
    
    // 1. Count Validation
    if (files.length + newFilesList.length > MAX_FILES) {
      setErrorMessage(`Limit exceeded: You can only upload up to ${MAX_FILES} images.`);
      event.target.value = null;
      return;
    }

    const validFiles = [];
    let errorOccurred = false;

    // 2. Size & Type Validation
    newFilesList.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        console.warn(`File rejected (Wrong Type): ${file.name}`);
        errorOccurred = true;
        return;
      }
      
      if (file.size < MIN_SIZE_BYTES || file.size > MAX_SIZE_BYTES) {
        console.warn(`File rejected (Wrong Size): ${file.name}`);
        errorOccurred = true;
        return;
      }

      validFiles.push({
        file: file,
        preview: URL.createObjectURL(file)
      });
    });

    if (errorOccurred) {
      setErrorMessage(`Some files were skipped. Ensure they are JPG/PNG and between 60KB - 2MB.`);
    }

    setFiles((prev) => [...prev, ...validFiles]);
    event.target.value = null; 
  };

  const removeImage = (indexToRemove) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[indexToRemove].preview);
      newFiles.splice(indexToRemove, 1);
      return newFiles;
    });
    setErrorMessage('');
  };

  // --- Derived State for UI ---
  const fileCount = files.length;
  const isRequirementMet = fileCount >= MIN_FILES && fileCount <= MAX_FILES;

  return (
    <Box sx={{ maxWidth: 600, margin: '20px auto' }}>
      
      <Stack spacing={2}>
        {errorMessage && (
          <Alert severity="warning" onClose={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        )}

        {/* Dropzone */}
        <Paper
          variant="outlined"
          onClick={handleBoxClick}
          sx={{
            p: 4,
            borderStyle: 'dashed',
            borderWidth: 2,
            borderColor: isRequirementMet ? 'success.main' : 'grey.400',
            backgroundColor: 'grey.50',
            textAlign: 'center',
            cursor: 'pointer',
            transition: '0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'grey.100',
            },
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="h6" color="text.primary">
            Click to upload images
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Min {MIN_FILES}, Max {MAX_FILES} images. <br />
            JPG or PNG (60KB - 2MB).
          </Typography>
        </Paper>

        {/* Status */}
        <Box display="flex" alignItems="center" gap={1}>
           <Typography 
             variant="body2" 
             color={isRequirementMet ? 'success.main' : 'text.secondary'}
             sx={{ fontWeight: 'medium' }}
           >
             Selected: {fileCount} images. 
             {!isRequirementMet && ` (Need ${Math.max(0, MIN_FILES - fileCount)} more)`}
           </Typography>
           {isRequirementMet && <CheckCircleIcon color="success" fontSize="small" />}
        </Box>

        {/* Image Grid */}
        <Grid container spacing={2}>
          {files.map((item, index) => (
            <Grid item xs={6} sm={4} md={3} key={item.preview}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100px', // Explicit height to prevent collapse
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'grey.200'
                }}
              >
                <img
                  src={item.preview}
                  alt={`preview-${index}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                
                <IconButton
                  size="small"
                  onClick={() => removeImage(index)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'white',
                      color: 'error.main',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Stack>

      <input
        type="file"
        accept="image/png, image/jpeg"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default MultiImageUploader;