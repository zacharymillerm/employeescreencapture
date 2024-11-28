import React, { useState } from "react";
import Modal from "./Modal";
import config from "../config";

const { SERVER_URL } = config;

const formatFilename = (filePath) => {
    try {
        const filename = filePath.split('\\').pop().split('/').pop();
        const nameWithoutExtension = filename.replace('.png', '');
        const [date, time] = nameWithoutExtension.split('_');
        const formattedTime = time.replace(/-/g, ':');
        return `${date} ${formattedTime}`;
    } catch {
        return 'Unknown Time';
    }
};

const ScreenshotViewer = ({ screenshots }) => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 16;
  const totalPages = Math.ceil(screenshots.length / itemsPerPage);

  const paginatedScreenshots = screenshots.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleViewMode = () =>
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));

  const openImageModal = (imageSrc) => {
    try {
      setSelectedImage(imageSrc);
      setError(null);
    } catch (err) {
      setError("Failed to open the image. Please try again.");
    }
  };

  const closeModal = () => {
    try {
      setSelectedImage(null);
      setError(null);
    } catch (err) {
      setError("Failed to close the modal. Please try again.");
    }
  };

  const renderError = () =>
    error && <p className="text-red-500 text-center mt-4">{error}</p>;

  const goToPage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (!screenshots || !screenshots.length) return <p>No screenshots found</p>;

  return (
    <div className="mt-4">
      <div className="flex justify-end items-center mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleViewMode}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            {viewMode === "grid" ? "List View" : "Grid View"}
          </button>
          <div>
            <button
              onClick={() => goToPage(currentPage - 1)}
              className="px-2 py-1 border rounded"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="mx-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              className="px-2 py-1 border rounded"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {renderError()}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "flex flex-col gap-4"
        }
      >
        {paginatedScreenshots.map((screenshot, idx) => (
          <div
            key={idx}
            className={`border border-dashed border-slate-500 rounded shadow-lg ${
              viewMode === "list" ? "flex items-center p-4" : "flex flex-col"
            }`}
            onClick={() => {
              try {
                openImageModal(`${SERVER_URL}/${screenshot}`);
              } catch (err) {
                setError("Unable to display this screenshot.");
              }
            }}
          >
            <img
              src={`${SERVER_URL}/${screenshot}`}
              alt="Screenshot"
              onError={() =>
                setError(`Error loading image: ${screenshot.split("/").pop()}`)
              }
              className={
                viewMode === "list"
                  ? "w-auto h-20 object-cover mr-4"
                  : "w-full h-40 object-cover"
              }
            />
            {viewMode === "list" ? (
              <p className="text-sm text-gray-700">
                {screenshot.time || formatFilename(screenshot)}
              </p>
            ) : (
              <div className="text-center mt-2 text-sm text-gray-500">
                {formatFilename(screenshot)}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedImage && <Modal imageSrc={selectedImage} onClose={closeModal} />}
    </div>
  );
};

export default ScreenshotViewer;
