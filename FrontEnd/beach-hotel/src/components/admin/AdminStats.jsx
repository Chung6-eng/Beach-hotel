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

  // 🔹 Tính tổng
  const getTotal = (obj) =>
    obj ? Object.values(obj).reduce((sum, val) => sum + val, 0) : 0;

 // 🔹 SORT DỮ LIỆU
const sortData = (obj, type) => {
  if (!obj) return { labels: [], values: [] };

  let entries = Object.entries(obj);

  if (type === "year") {
    entries.sort((a, b) => Number(a[0]) - Number(b[0]));
  }

if (type === "month") {
  entries.sort((a, b) => {
    const monthA = parseInt(a[0].replace(/\D/g, ""));
    const monthB = parseInt(b[0].replace(/\D/g, ""));
    return monthA - monthB;
  });
}



  if (type === "day") {
    const dayOrder = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];

    entries.sort(
      (a, b) =>
        dayOrder.indexOf(a[0]) - dayOrder.indexOf(b[0])
    );
  }

  return {
    labels: entries.map(e => e[0]),
    values: entries.map(e => e[1])
  };
};


  const dayData = sortData(stats.byDay, "day");
  const monthData = sortData(stats.byMonth, "month");
  const yearData = sortData(stats.byYear, "year");

  const barData = (labels, values) => ({
    labels,
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

      {/* DAY */}
      <div className="card mb-4 p-3 shadow">
        <h4 className="text-primary text-center">
          Revenue by Day of Week
        </h4>
        <p className="text-center fw-bold">
          Total: ${getTotal(stats.byDay)}
        </p>
        <Bar
          data={barData(dayData.labels, dayData.values)}
          options={barOptions}
        />
      </div>

      {/* MONTH */}
      <div className="card mb-4 p-3 shadow">
        <h4 className="text-success text-center">
          Revenue by Month
        </h4>
        <p className="text-center fw-bold">
          Total: ${getTotal(stats.byMonth)}
        </p>
        <Bar
          data={barData(monthData.labels, monthData.values)}
          options={barOptions}
        />
      </div>

      {/* YEAR */}
      <div className="card mb-4 p-3 shadow">
        <h4 className="text-dark text-center">
          Revenue by Year
        </h4>
        <p className="text-center fw-bold">
          Total: ${getTotal(stats.byYear)}
        </p>
        <Bar
          data={barData(yearData.labels, yearData.values)}
          options={barOptions}
        />
      </div>
    </div>
  );
};

export default AdminStats;
