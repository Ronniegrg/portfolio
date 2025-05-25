import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useContext } from "react";
import ThemeContext from "../context/ThemeContextInstance";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Component for visualizing Cumulative Layout Shift metric
 * @param {Object} props - Component props
 * @param {number} props.cls - Cumulative Layout Shift score
 */
const CLSChart = ({ cls }) => {
  // Get theme context to adapt chart colors
  const { isDarkMode } = useContext(ThemeContext);

  // Set chart colors based on theme
  const textColor = isDarkMode ? "#e1e1e1" : "#333333";

  // CLS score zones (based on web.dev CLS thresholds)
  // Good: 0 to 0.1, Needs Improvement: 0.1 to 0.25, Poor: > 0.25
  let backgroundColor = "rgba(75, 192, 100, 0.7)"; // Good - Green
  let borderColor = "rgba(75, 192, 100, 1)";

  if (cls > 0.25) {
    backgroundColor = "rgba(255, 99, 132, 0.7)"; // Poor - Red
    borderColor = "rgba(255, 99, 132, 1)";
  } else if (cls > 0.1) {
    backgroundColor = "rgba(255, 206, 86, 0.7)"; // Needs improvement - Yellow
    borderColor = "rgba(255, 206, 86, 1)";
  }

  // Calculate the remaining segment (to make a full circle)
  const remainingSegment = cls < 1 ? 1 - cls : 0;

  // Prepare data for the doughnut chart
  const chartData = {
    labels: ["CLS Score", ""],
    datasets: [
      {
        data: [cls, remainingSegment],
        backgroundColor: [
          backgroundColor,
          isDarkMode ? "rgba(50, 50, 50, 0.2)" : "rgba(240, 240, 240, 0.5)",
        ],
        borderColor: [
          borderColor,
          isDarkMode ? "rgba(50, 50, 50, 0.1)" : "rgba(240, 240, 240, 0.3)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.dataIndex === 0) {
              return `CLS: ${context.raw.toFixed(3)}`;
            }
            return "";
          },
        },
      },
      title: {
        display: true,
        text: "Cumulative Layout Shift",
        color: textColor,
        font: {
          size: 16,
        },
      },
    },
  };

  // Get scoring description
  let scoreDescription = "Good";
  let scoreColor = "#4CAF50";

  if (cls > 0.25) {
    scoreDescription = "Poor";
    scoreColor = "#F44336";
  } else if (cls > 0.1) {
    scoreDescription = "Needs Improvement";
    scoreColor = "#FFC107";
  }

  // Show placeholder if metrics are not available
  if (cls === null) {
    return (
      <div
        className="chart-container"
        style={{
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>No CLS data available yet</p>
      </div>
    );
  }

  return (
    <div
      className="chart-container"
      style={{ height: "300px", position: "relative" }}
    >
      <Doughnut data={chartData} options={options} />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{ fontSize: "24px", fontWeight: "bold", color: scoreColor }}
        >
          {cls.toFixed(3)}
        </div>
        <div style={{ fontSize: "14px", color: scoreColor }}>
          {scoreDescription}
        </div>
      </div>
    </div>
  );
};

export default CLSChart;
