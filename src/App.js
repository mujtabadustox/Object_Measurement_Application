import React, { useState } from "react";
import axios from "axios";
import Measure from "./Measure";

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const handleImageChange = (event) => {
    setProcessedImage(null);
    const file = event.target.files[0];
    console.log("asdddd", file);
    setSelectedImage(file);
  };

  const handleImageSubmit = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);

      try {
        const response = await axios.post(
          "http://localhost:4000/backend/process-image",
          formData
        );

        const { imagePath } = response.data;
        setProcessedImage(imagePath);
        setSelectedImage(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <Measure
        handleImageChange={handleImageChange}
        handleImageSubmit={handleImageSubmit}
        processedImage={processedImage}
      />
    </div>
  );
};

export default App;
