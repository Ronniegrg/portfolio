import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useContext } from "react";
import ThemeContext from "../context/ThemeContextInstance";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Component for visualizing performance metrics in a bar chart
 * @param {Object} props - Component props
 * @param {Object} props.metrics - Performance metrics data
 */
const PerformanceChart = ({ metrics }) => {
  // Get theme context to adapt chart colors
  const { isDarkMode } = useContext(ThemeContext);

  // Set chart colors based on theme
  const textColor = isDarkMode ? "#e1e1e1" : "#333333";
  const gridColor = isDarkMode
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)";

  // Prepare data for the chart
  const chartData = {
    labels: ["FCP", "LCP", "TTFB", "FID", "CLS"],
    datasets: [
      {
        label: "Performance Metrics (ms)",
        data: [
          metrics.fcp,
          metrics.lcp,
          metrics.ttfb,
          metrics.fid,
          // CLS needs to be multiplied for better visualization
          metrics.cls ? metrics.cls * 1000 : null,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)", // FCP - Blue
          "rgba(255, 206, 86, 0.7)", // LCP - Yellow
          "rgba(75, 192, 192, 0.7)", // TTFB - Teal
          "rgba(153, 102, 255, 0.7)", // FID - Purple
          "rgba(255, 99, 132, 0.7)", // CLS - Red
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
        title: {
          display: true,
          text: "Time (ms)",
          color: textColor,
        },
      },
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              // Check if this is the CLS metric (which is the 5th item in our data array)
              if (context.dataIndex === 4) {
                // Convert back to original CLS value for display
                label += (context.parsed.y / 1000).toFixed(4);
              } else {
                label += context.parsed.y.toFixed(2) + " ms";
              }
            }
            return label;
          },
        },
      },
      title: {
        display: true,
        text: "Web Vitals Performance Metrics",
        color: textColor,
        font: {
          size: 16,
        },
      },
    },
  };
  // Show placeholder if metrics are not available
  if (
    !metrics.fcp &&
    !metrics.lcp &&
    !metrics.ttfb &&
    !metrics.fid &&
    !metrics.cls
  ) {
    return (
      <div
        className="chart-container"
        style={{
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>No performance data available yet</p>
      </div>
    );
  }

  return (
    <div className="chart-container" style={{ height: "400px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PerformanceChart;
