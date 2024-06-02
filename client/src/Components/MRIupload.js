import React, { useState } from 'react';
import './MRIupload.css';
import { useNavigate } from 'react-router-dom';

const MRIupload = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [userInfo, setUserInfo] = useState({
    userName: '',
    userEmail: '',
    userAge: '',
    userId: '',
  });

  const handleImageChange = (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      setUploadedImage(file);

      // Generate preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (userInfo.userName && uploadedImage) {
      navigate('/display', {
        state: {
          image: imagePreviewUrl,
          patientName: userInfo.userName,
          patientId: userInfo.userId,
          patientAge: userInfo.userAge
        }
      });
    } else {
      alert("Patient name or image is missing.");
    }
  };

  return (
    <div className="analysis-card">
      <div className="header-container">
        <h2>Patient Information</h2>
        <p>Enter patient details</p>
      </div>

      <div className="content">
          
        <form onSubmit={handleFormSubmit} className="user-info-form">
        <div className="form-group">
             <label htmlFor="userAge">Patient ID</label>
             <input type="number" id="pId" name="userId" placeholder="Enter ID" value={userInfo.userId} onChange={handleInputChange} required />
          </div>
           <div className="form-group">
            <label htmlFor="userName">Name</label>
             <input type="text" id="userName" name="userName" placeholder="Enter name" value={userInfo.userName} onChange={handleInputChange} required />
           </div>
          <div className="form-group">
             <label htmlFor="userAge">Age</label>
             <input type="number" id="userAge" name="userAge" placeholder="Enter age" value={userInfo.userAge} onChange={handleInputChange} required />
          </div>

          
          <button type="submit" className="btn btn-primary">Submit Information</button>
        </form>

         <div className="image-upload-container">
          {imagePreviewUrl ? (
            <img src={imagePreviewUrl} alt="Uploaded MRI Preview" className="image-preview" />
          ) : (
            <div className="image-preview-placeholder">
              <span>Image preview will be shown here</span>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="mri-upload" className="btn btn-primary">Upload MRI Image</label>
            <input type="file" id="mri-upload" onRateChange={(e) => setUploadedImage(e.target.files[0])} hidden onChange={handleImageChange} required />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MRIupload;
