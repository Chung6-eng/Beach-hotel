import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const RevenueStats = () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const token = localStorage.getItem("token");

  
  const fetchRevenue = async () => {
  try {
    const response = await axios.get(
      `http://localhost:2204/api/revenue/daily-in-month?month=${month}&year=${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("Revenue API Response:", response.data);

    if (!Array.isArray(response.data)) {
      console.error("Invalid data format from API:", response.data);
      setData([]);
      return;
    }

    const formattedData = response.data.map(item => ({
      day: `Ngày ${item.day}`,
      revenue: item.revenue
    }));

    setData(formattedData);

  } catch (err) {
    console.error("Error fetching revenue:", err);
    setData([]);
  }
};



  useEffect(() => {
    fetchRevenue();
  }, [month, year]);

  return (
    <div className="container mt-4">
      <h3>Doanh thu theo ngày trong tháng</h3>

      <div className="d-flex gap-3 my-3">
        <input type="number" min="1" max="12" value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="form-control" />
        <input type="number" value={year}
          onChange={(e) => setYear(e.target.value)}
          className="form-control" />
        <button className="btn btn-primary" onClick={fetchRevenue}>
          Refresh
        </button>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="day"/>
          <YAxis/>
          <Tooltip/>
          <Bar dataKey="revenue" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueStats;
