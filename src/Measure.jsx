import React, { useState } from "react";
import "./index.css";
import img1 from "./image-placeholder.svg";

const Measure = ({ handleImageChange, handleImageSubmit, processedImage }) => {
  console.log("AAAAA", processedImage);
  /* filter variables */

  let rotate = 0;
  let brigh = "100";
  let gs = "0";
  let zoom = 0;
  let abc = document.querySelector(".slider input");
  let img = document.querySelector(".preview-img img");
  let xyz = document.querySelector(".filter-info");

  let xyz1 = document.querySelector(".filter-info .name");
  let xyz2 = document.querySelector(".filter-info .value");

  /* filter functions */

  function applyChanges() {
    img.style.transform = "rotate(" + rotate + "deg)" + "scale(" + zoom + ")";
    img.style.filter = "brightness(" + brigh + "%)" + "grayscale(" + gs + "%)";
  }
  const handleSaveImage = () => {
    const imageUrl = `http://localhost:4000/uploads/${processedImage}`;

    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "output.png";
        link.click();

        URL.revokeObjectURL(link.href); // Clean up the temporary URL
      })
      .catch((error) => {
        console.error("Error occurred while saving the image:", error);
      });
  };

  const handleResetFilters = () => {
    // Reset any applied filters
    // Perform necessary operations
    const previewImage = document.querySelector(".preview-img img");
    previewImage.style.filter = "none";
  };

  const handleBrightness = () => {
    // Apply brightness filter
    // Perform necessary operations
    let pyo = document.querySelector("#brightness");
    document.querySelector("#grayscale").classList.remove("active");
    document.querySelector("#zoom").classList.remove("active");
    pyo.classList.add("active");

    abc.max = "200";
    xyz1.innerText = "Brightness";
    xyz2.innerText = brigh + "%";
    abc.value = brigh;
  };

  const handleFilterChange = () => {
    xyz.value = abc.value;
    const selectedOption = document.querySelector(".filter .active");

    if (selectedOption.id === "brightness") {
      brigh = abc.value;
      xyz2.innerText = abc.value + "%";
    } else if (selectedOption.id === "grayscale") {
      gs = abc.value;
      xyz2.innerText = abc.value + "%";
    } else if (selectedOption.id === "zoom") {
      zoom = abc.value;
      xyz2.innerText = abc.value + "times";
    }

    applyChanges();
  };

  const handleZoom = () => {
    // Apply zoom filter
    // Perform necessary operations
    let pyo = document.querySelector("#zoom");
    document.querySelector("#brightness").classList.remove("active");
    document.querySelector("#grayscale").classList.remove("active");
    pyo.classList.add("active");

    abc.max = "10";
    xyz1.innerText = "Zoom";
    xyz2.innerText = zoom + "times";
    abc.value = zoom;
  };

  const handleGrayscale = () => {
    // Apply grayscale filter
    // Perform necessary operations
    let pyo = document.querySelector("#grayscale");
    document.querySelector("#brightness").classList.remove("active");
    document.querySelector("#zoom").classList.remove("active");
    pyo.classList.add("active");

    abc.max = "100";
    xyz1.innerText = "Grayscale";
    xyz2.innerText = gs + "%";
    abc.value = gs;
  };

  const handleRotateLeft = () => {
    let img = document.querySelector(".preview-img img");

    console.log(rotate);

    let b = parseInt(rotate);

    rotate = b;

    if (rotate >= -270) {
      console.log(rotate);

      //rotate = y ;
      rotate = rotate + -90;

      //let u = "rotate(" + y +"deg)" ;

      //console.log(u);

      //console.log(y);

      //img.style.transform = u;

      if (rotate == -360) {
        rotate = 0;
      }
    }

    applyChanges();
  };

  const handleRotateRight = () => {
    // Rotate image right
    // Perform necessary operations
    let img = document.querySelector(".preview-img img");

    let c = parseInt(rotate);

    rotate = c;

    if (rotate <= 270) {
      console.log(rotate);
      //rotate = y1 ;
      rotate = rotate + 90;

      //let u1 = "rotate(" + y1 +"deg)" ;

      //console.log(u1);

      //console.log(y1);

      //img.style.transform = u1;

      if (rotate == 360) {
        rotate = 0;
      }
    }
    applyChanges();
  };

  return (
    <div>
      <div className="container">
        <h1>Image Processing App</h1>
        <div className="wrapper">
          <div className="editor-panel">
            {/* Filter buttons */}
            <div className="filter">
              <label className="title">Filters</label>
              <div className="options">
                <button id="brightness" onClick={handleBrightness}>
                  Brightness
                </button>
                <button id="zoom" onClick={handleZoom}>
                  Zoom
                </button>
                <button id="grayscale" onClick={handleGrayscale}>
                  Grayscale
                </button>
                <button id="rotate-left" onClick={handleRotateLeft}>
                  Rotate Left
                </button>
                <button id="rotate-right" onClick={handleRotateRight}>
                  Rotate Right
                </button>
              </div>
              {/* Slider for brightness */}
              <div className="slider">
                <div className="filter-info">
                  <p className="name">Brightness</p>
                  <p className="value">100%</p>
                </div>
                <input
                  type="range"
                  defaultValue="100"
                  min="0"
                  max="200"
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>
          {/* Preview image */}
          <div className="preview-img">
            {processedImage ? (
              <div>
                <img
                  src={`http://localhost:4000/uploads/${processedImage}`}
                  alt="Processed"
                />
              </div>
            ) : (
              <div>
                <img src={img1} alt="Placeholder" />
              </div>
            )}
          </div>
        </div>
        <div className="controls">
          {/* Reset Filters button */}
          <button className="reset-filter" onClick={handleResetFilters}>
            Reset Filters
          </button>
          {/* Process Image button */}
          <button className="reset-filter" onClick={handleImageSubmit}>
            Process Image
          </button>
          <div className="row">
            {/* Select Image input */}
            <input
              className="reset-filter"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {/* Save Image button */}
            <button className="save-img" onClick={handleSaveImage}>
              Save Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Measure;
