import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchScreenshots } from "../api/api";
import Modal from "../components/Modal";
import config from "../config";
import ActivityGraph from "../components/ActivityGraph";

const { SERVER_URL } = config;

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatFilename = (filePath) => {
  try {
    // Assuming filePath is in the format: uploads\Eye\2024-12-23_06-57-53.jpg
    const timePart = filePath.split("_")[1]; // Extract the time part (06-57-53.jpg)
    
    // Extract mm:ss
    const mm_ss = timePart.substring(3, 8); // mm:ss part from "06-57-53"
    
    // Extract and convert the hour
    const hour = (parseInt(timePart.substring(0, 2), 10) - 5 + 24) % 24;
    const formattedHour = String(hour).padStart(2, '0');

    // Return formatted time in HH:mm:ss
    return `${formattedHour}:${mm_ss.replace("-", ":")}`; // Replace the first dash with a colon
  } catch (error) {
    console.error(error); // Log the error for debugging
    return "Unknown Time";
  }
};

const getHourFromFilename = (filePath) => {
  try {
    const hour = filePath.split("_")[1].substring(0, 2);
    return (parseInt(hour, 10) - 5 + 24) % 24; // EST Time Zone
  } catch {
    return null;
  }
};

const EmployeeDetail = () => {
  const { employeeId } = useParams();

  // Set default start and end dates
  const today = new Date();

  const [startDate, setStartDate] = useState(formatDate(today));
  const [screenshots, setScreenshots] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [selectedHour, setSelectedHour] = useState(today.getHours());
  const [showActivityGraph, setShowActivityGraph] = useState(false);
  const [activityData, setActivityData] = useState(null);

  useEffect(() => {
    if (employeeId) {
      const fetchScreenshotsByDate = async () => {
        try {
          const { data } = await fetchScreenshots(
            employeeId,
            startDate,
            startDate
          );
          setScreenshots(data.screenshots || []);
        } catch (error) {
          console.error("Error fetching screenshots:", error);
          alert("Failed to fetch screenshots.");
        }
      };

      fetchScreenshotsByDate();
    }
  }, [employeeId, startDate]); // Dependencies: Trigger when these values change

  useEffect(() => {
    const activity = screenshots.reduce((acc, screenshot) => {
      const hour = getHourFromFilename(screenshot);
      if (hour !== null) {
        acc[hour] = (acc[hour] || 0) + 1;
      }
      return acc;
    }, {}); // Provide an initial value as an empty object

    setActivityData(activity);
  }, [screenshots]); // Include screenshots as a dependency

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

  const filterScreenshotsByHour = (hour) =>
    screenshots.filter(
      (screenshot) => getHourFromFilename(screenshot) === hour
    );

  const displayedScreenshots =
    selectedHour !== null ? filterScreenshotsByHour(selectedHour) : screenshots;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">
        {employeeId ? `Employee ID: ${employeeId}` : "Employee Detail"}
      </h1>
      <div className="my-8 flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-auto flex items-center space-x-2">
          <button
            onClick={() =>
              setStartDate((prevDate) => {
                const newDate = new Date(prevDate + "T00:00:00"); // Parse the string into a Date object
                newDate.setDate(newDate.getDate() - 1); // Subtract 1 day
                return formatDate(newDate);
              })
            }
            className="bg-blue-600 text-white px-2 py-2 rounded"
          >
            Prev
          </button>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2"
          />

          <button
            onClick={() =>
              setStartDate((prevDate) => {
                const newDate = new Date(prevDate + "T00:00:00"); // Parse the string into a Date object
                newDate.setDate(newDate.getDate() + 1); // Add 1 day
                return formatDate(newDate);
              })
            }
            className="bg-blue-600 text-white px-2 py-2 rounded"
          >
            Next
          </button>
        </div>

        <div className="w-full md:w-auto">
          <button
            onClick={() => setShowActivityGraph(!showActivityGraph)}
            className="bg-green-500 text-white px-4 py-2 rounded w-full md:w-auto"
          >
            {showActivityGraph ? "Screenshots" : "Activity Graph"}
          </button>
        </div>
      </div>

      {showActivityGraph ? (
        <div className="my-8">
          <ActivityGraph data={activityData} />
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap justify-center gap-2 my-4">
            <div className="w-full md:w-auto">
              <button
                onClick={toggleViewMode}
                className="bg-red-400 h-12 text-white px-4 py-2 rounded w-full md:w-auto"
              >
                {viewMode === "grid" ? "List View" : "Grid View"}
              </button>
            </div>
            {Array.from({ length: 24 }, (_, i) => {
              const hasActivity = activityData && activityData[i] > 0; // Check if there's activity for the hour
              return (
                <button
                  key={i}
                  onClick={() => setSelectedHour(i)}
                  className={`w-12 h-12 flex items-center justify-center border rounded ${
                    selectedHour === i && "bg-blue-600 text-white"
                  } ${hasActivity && "border-red-500"}`}
                >
                  {i.toString().padStart(2, "0")}
                </button>
              );
            })}
            {/* <button
              onClick={() => setSelectedHour(null)}
              className="px-2 py-1 border rounded bg-gray-300"
            >
              Show All
            </button> */}
          </div>

          {renderError()}

          {displayedScreenshots.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "flex flex-col gap-4"
              }
            >
              {displayedScreenshots.length > 0 ? (
                displayedScreenshots.map((screenshot, idx) => {
                  const currentScreenshotTime = new Date(
                    formatFilename(screenshot).split(".")[0]
                  );

                  const previousScreenshotTime =
                    idx > 0
                      ? new Date(
                          formatFilename(displayedScreenshots[idx - 1]).split(
                            "."
                          )[0]
                        )
                      : null;

                  const timeGap = previousScreenshotTime
                    ? (currentScreenshotTime - previousScreenshotTime) / 1000
                    : 0;

                  const shouldShowGap = timeGap > 35;

                  const containerClasses = `border border-dashed border-slate-500 rounded shadow-lg ${
                    viewMode === "list"
                      ? "flex items-center p-4"
                      : "flex flex-col"
                  }`;

                  const imageClasses =
                    viewMode === "list"
                      ? "w-auto h-20 object-cover mr-4"
                      : "w-full h-40 object-cover";

                  const captionClasses =
                    viewMode === "list"
                      ? "text-sm text-gray-700 font-bold text-lg"
                      : "text-center mt-2 text-sm text-gray-500 font-bold text-lg";

                  return (
                    <>
                      {shouldShowGap && (
                        <div
                          key={`gap-${idx}`}
                          className={
                            viewMode === "grid"
                              ? "border border-dashed border-slate-500 rounded shadow-lg"
                              : containerClasses
                          }
                        >
                          <img
                            src="/timeoff.jpg"
                            alt="Time Gap Indicator"
                            className={imageClasses.replace(
                              "object-cover",
                              "object-fill"
                            )}
                          />
                          <div
                            className={`${captionClasses} text-red-500`}
                          >
                            Time Gap: {Math.floor(timeGap / 3600)} hrs{" "}
                            {Math.floor((timeGap % 3600) / 60)} mins{" "}
                            {timeGap % 60} sec
                          </div>
                        </div>
                      )}

                      <div
                        key={idx}
                        className={containerClasses}
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
                            setError(
                              `Error loading image: ${screenshot
                                .split("/")
                                .pop()}`
                            )
                          }
                          className={imageClasses}
                        />
                        <div className={captionClasses}>
                          {formatFilename(screenshot)}
                        </div>
                      </div>
                    </>
                  );
                })
              ) : (
                <p>No Scr</p>
              )}
            </div>
          ) : (
            <p className="p-8 text-center font-bold">No Screenshot</p>
          )}

          {selectedImage && (
            <Modal imageSrc={selectedImage} onClose={closeModal} />
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;
