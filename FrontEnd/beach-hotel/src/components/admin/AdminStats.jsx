import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminStats = () => {
  const [stats, setStats] = useState({
    byDay: {},
    byMonth: {},
    byYear: {}
  });
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:2204/api/admin/revenue";
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setStats(res.data))
      .catch(err => {
        console.error("Error fetching stats:", err);
        setError("Cannot fetch revenue data. Unauthorized or server error.");
      });
  }, []);

  // Hàm tính tổng doanh thu từ object
  const getTotal = (obj) =>
    obj ? Object.values(obj).reduce((sum, val) => sum + val, 0) : 0;

  const barData = (labels, values) => ({
    labels: labels,
    datasets: [
      {
        label: "Revenue",
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }
    ]
  });

  const barOptions = {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  };

  if (error) {
    return (
      <div className="container mt-4">
        <h2 className="text-center text-danger">{error}</h2>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">📊 Revenue Statistics</h2>

      <div className="card mb-4 p-3 shadow">
        <h4 className="text-primary text-center">Revenue by Day of Week</h4>
        <p className="text-center fw-bold">
          Total: ${getTotal(stats.byDay)}
        </p>
        <Bar
          data={barData(
            stats.byDay ? Object.keys(stats.byDay) : [],
            stats.byDay ? Object.values(stats.byDay) : []
          )}
          options={barOptions}
        />
      </div>

      <div className="card mb-4 p-3 shadow">
        <h4 className="text-success text-center">Revenue by Month</h4>
        <p className="text-center fw-bold">
          Total: ${getTotal(stats.byMonth)}
        </p>
        <Bar
          data={barData(
            stats.byMonth ? Object.keys(stats.byMonth) : [],
            stats.byMonth ? Object.values(stats.byMonth) : []
          )}
          options={barOptions}
        />
      </div>

      <div className="card mb-4 p-3 shadow">
        <h4 className="text-danger text-center">Revenue by Year</h4>
        <p className="text-center fw-bold">
          Total: ${getTotal(stats.byYear)}
        </p>
        <Bar
          data={barData(
            stats.byYear ? Object.keys(stats.byYear) : [],
            stats.byYear ? Object.values(stats.byYear) : []
          )}
          options={barOptions}
        />
      </div>
    </div>
  );
};

export default AdminStats;
