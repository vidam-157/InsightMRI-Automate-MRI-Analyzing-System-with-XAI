import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './AnalysisResult.css';
const map = require("./savedmaps/heatmap_D_Implementation_InsightMRI_client_src_Components_savedmaps_uploadedImage.jpg");

const AnalysisResult = () => {

  const location = useLocation();
  const { image, patientName, patientId, patientAge } = location.state || {};
  const [modelPrediction, setModelPrediction] = useState('');
  const [heatMapImage, setHeatMapImage] = useState('');
  const [analysisCompleted, setAnalysisCompleted] = useState(false);

// front end button call that generates the heatmap
  const handleAnalysis = async () => {

    if (!image) {
      console.error('No image available for analysis');
      return;
    }
  
    try {
      const response = await fetch(image);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const blob = await response.blob();
      const file = new File([blob], "uploadedImage.jpg", { type: "image/jpeg" });
  
      const formData = new FormData();
      formData.append('image', file);
  
      // Send FormData to Flask backend
      const data = await fetch('http://localhost:5000/explain', {
        method: 'POST',
        body: formData,
      });
  
      const analysisData = await data.json();
      console.log("Prediction Data:", analysisData);
  
      if (analysisData.error) {
        console.error('Error from backend:', analysisData.error);
        // Handle backend errors gracefully (e.g., display an error message to the user)
        return;
      }
  
      setModelPrediction(analysisData.prediction); // Assuming predicted_class_name is available
  
      // Update heatmap image using the provided path
      setHeatMapImage(analysisData.heatmap_path);  // Assuming heatmap_path is the path returned by the backend
  
      setAnalysisCompleted(true);
    } catch (error) {
      console.error('Error:', error);
      // Handle errors during image fetching or backend communication
    }
  };

  return (
    <div className="analysis-result-card">
      <div className="analysis-result-card-header">
        <h1>Image Analyze Results</h1>
        <p>We analyze your MRIs for you</p>
      </div>
      <div className="analysis-result-card-body">
        <p className='fetched-data'>Patient ID: {patientId}<br />Patient Name: {patientName} <br /> Age: {patientAge} </p>
        <img src={image} alt="Uploaded MRI" className="mri-image" style={{ width: '350px', height: '350px' }}/>

        <div className="analysis-actions">
          <button onClick={handleAnalysis} className="btn btn-primary">Run Analysis</button>
        </div>
        <br></br>
        {modelPrediction && (
          <div className="model-prediction">
            <h4>Tumor Type</h4>
            <p className='tumor'>{modelPrediction}</p>
          </div>
        )}
        {heatMapImage && (
          <div className="heat-map-container">
            <h4>Model Interpretation</h4>
            <img src={map} alt="Heat Map" className="heat-map-image"/>
          </div>
)}
        {analysisCompleted && (
          <div className="results-options">
            <button className="btn btn-primary">Save Results</button>
            <button className="btn btn-primary">Back</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;