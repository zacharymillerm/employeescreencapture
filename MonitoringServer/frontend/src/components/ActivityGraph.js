// ActivityGraph.js
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register the required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ActivityGraph = ({ data }) => {
  // Create an array of labels for the hours (00 to 23)
  const labels = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));

  // Map the activity data to match the labels, defaulting to 0 if no data is provided for an hour
  const activityData = labels.map((hour) => data[hour] || 0);

  // Define the data and appearance for the chart
  const chartData = {
    labels,
    datasets: [
      {
        label: "Activity (Screenshots per Hour)",
        data: activityData,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3, // Smooth line
      },
    ],
  };

  // Configure chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Screenshots",
        },
      },
      x: {
        title: {
          display: true,
          text: "Hours",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ActivityGraph;
