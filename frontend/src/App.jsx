import ImageUpload from "./ImageUpload";
// src/App.js
import React from "react";
import "./index.css";

function App() {
  return (
    <div className="bg-blue-800 min-h-screen flex items-center justify-center">
      <header className="text-white text-center">
        <h1 className="text-4xl font-bold text-center px- py-2">
          Flower Classifier
        </h1>
        <ImageUpload />
      </header>
    </div>
  );
}

export default App;
