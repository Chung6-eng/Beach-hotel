import React, { useState, useEffect } from "react";
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/+$/, "")

const TotalRevenue = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [revenueData, setRevenueData] = useState({ totalRevenue: 0, roomTypes: [] });

  const token = localStorage.getItem("token");

  const totalNumberOfBookings = revenueData.roomTypes.reduce((sum, room) => sum + room.count, 0);

  useEffect(() => {
    fetchRevenue();
  }, [month, year]);

  const fetchRevenue = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/monthly-revenue-details`, {
        params: { month, year },
        headers: { Authorization: `Bearer ${token}` }
      });
      setRevenueData(response.data || { totalRevenue: 0, roomTypes: [] });
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
      setRevenueData({ totalRevenue: 0, roomTypes: [] });
    }
  };

  const exportPDF = () => {

  const totalCount = revenueData.roomTypes.reduce(
    (sum, room) => sum + room.count,
    0
  );

  const tableBody = [
    [
      { text: "Loại phòng", bold: true },
      { text: "Số lượng đặt phòng", bold: true },
      { text: "Doanh thu", bold: true }
    ],
    ...revenueData.roomTypes.map(room => ([
      room.type,
      room.count.toString(),
      room.revenue.toLocaleString() + "$"
    ])),
    [
      { text: "Tổng doanh thu & tổng số lượng đặt phòng", bold: true },
      { text: totalCount.toString(), bold: true },
      { text: revenueData.totalRevenue.toLocaleString() + "$", bold: true }
    ]
  ];

  const docDefinition = {
    content: [
      { text: `Doanh thu tháng ${month} năm ${year}`, style: "title" },
      { text: "\n" },

      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto"],
          body: tableBody
        },
        layout: {
          fillColor: function (rowIndex) {
            return rowIndex === 0 ? "#F5F5F5" : null;
          }
        }
      }
    ],
    styles: {
      title: {
        fontSize: 18,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 10]
      }
    }
  };

  pdfMake.createPdf(docDefinition).download(`DoanhThu_${month}_${year}.pdf`);
};




  return (
    <div className="container mt-4">
      <h2>Tổng doanh thu tháng</h2>
      <div className="mb-3">
        <label>Tháng:</label>
        <input
          type="number"
          min="1"
          max="12"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label>Năm:</label>
        <input
          type="number"
          min="2000"
          max="2100"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="form-control"
        />
      </div>



      <table className="table mt-3">
        <thead>
          <tr>
            <th>Loại phòng</th>
            <th>Số lượng đặt phòng</th>
            <th>Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          {revenueData.roomTypes.map((room, index) => (
            <tr key={index}>
              <td>{room.type}</td>
              <td>{room.count}</td>
              <td>{room.revenue.toLocaleString()}$</td>
            </tr>
          ))}
          <tr>
            <td><strong>Tổng doanh thu & Số lượng đặt phòng</strong></td>
            <td><strong>{totalNumberOfBookings}</strong></td>
            <td><strong>{revenueData.totalRevenue.toLocaleString()}$</strong></td>
          </tr>
        </tbody>
      </table>

      <button className="btn btn-primary mt-3" onClick={exportPDF}>
        Xuất PDF
      </button>
    </div>
  );
};

export default TotalRevenue;
