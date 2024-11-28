import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchScreenshots } from "../api/api";
import ScreenshotViewer from "../components/ScreenshotViewer";
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const EmployeeDetail = () => {
  const { employeeId } = useParams();

  // Set default start and end dates
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const [startDate, setStartDate] = useState(formatDate(yesterday));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [screenshots, setScreenshots] = useState([]);

  useEffect(() => {
    if (employeeId) {
      const fetchInitialScreenshots = async () => {
        try {
          const { data } = await fetchScreenshots(
            employeeId,
            startDate,
            endDate
          );
          setScreenshots(data.screenshots || []);
        } catch (error) {
          console.error("Error fetching screenshots:", error);
        }
      };

      fetchInitialScreenshots();
    }
  }, [employeeId, startDate, endDate]); // Dependencies: Trigger when these values change

  const handleSearch = async () => {
    if (!employeeId) return alert("Invalid Employee ID");
    try {
      const { data } = await fetchScreenshots(employeeId, startDate, endDate);
      setScreenshots(data.screenshots || []);
    } catch (error) {
      console.error("Error fetching screenshots:", error);
      alert("Failed to fetch screenshots.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">
        {employeeId ? `Employee ID: ${employeeId}` : "Employee Detail"}
      </h1>
      <div className="mt-4 flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full md:w-auto">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 w-full md:w-auto"
          />
        </div>
        <div className="w-full md:w-auto">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 w-full md:w-auto"
          />
        </div>
        <div className="w-full md:w-auto">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
          >
            Search
          </button>
        </div>
      </div>
      <ScreenshotViewer screenshots={screenshots} />
    </div>
  );
};

export default EmployeeDetail;
