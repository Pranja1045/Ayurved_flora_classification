import React, { useState } from 'react';
import axios from 'axios';
import { getGroqChatCompletion } from './components/reqLLM';

function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [classificationResult, setClassificationResult] = useState('');
  const [chatCompletionResult, setChatCompletionResult] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError('Please select an image file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/classify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setClassificationResult(response.data.class);
        const chatResponse = await getGroqChatCompletion(response.data.class);
        const chatContent = chatResponse.choices[0]?.message?.content || '';
        setChatCompletionResult(chatContent);
        setError('');
      }
    } catch (error) {
      setError('An error occurred while uploading the image.');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Image Classification</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && <img src={preview} alt="Selected preview" style={{ maxWidth: '300px', marginTop: '10px' }} />}
        <button type="submit">Upload and Classify</button>
      </form>
      {classificationResult && (
        <div>
          <h2>Classification Result:</h2>
          <p>{classificationResult}</p>
          {chatCompletionResult && (
            <div>
              <h2>Chat Completion Result:</h2>
              <p>{chatCompletionResult}</p>
            </div>
          )}
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default ImageUpload;
