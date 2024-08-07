import React, { useState } from "react";
import axios from "axios";
import { getGroqChatCompletion } from "./components/reqLLM";
import ReadableResponse from "./components/ReadableResponse";

function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [classificationResult, setClassificationResult] = useState("");
  const [chatCompletionResult, setChatCompletionResult] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select an image file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/classify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setClassificationResult(response.data.class);
        const chatResponse = await getGroqChatCompletion(response.data.class);
        const chatContent = chatResponse.choices[0]?.message?.content || "";
        setChatCompletionResult(ReadableResponse(chatContent));
        setError("");
      }
    } catch (error) {
      setError("An error occurred while uploading the image.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-gray-800 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-300 hover:file:bg-gray-600"
        />
        {preview && (
          <img
            src={preview}
            alt="Selected preview"
            className="max-w-full h-auto mt-2"
          />
        )}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Upload and Classify
        </button>
      </form>
      {classificationResult && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
          <h2 className="text-xl font-bold">Classification Result:</h2>
          <p>{classificationResult}</p>
          {chatCompletionResult && (
            <div className="mt-4">
              <h2 className="text-xl font-bold">Chat Completion Result:</h2>
              <p>{chatCompletionResult}</p>
            </div>
          )}
        </div>
      )}
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
}

export default ImageUpload;
