// src/components/ReceiptForm.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ReceiptForm = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([{ }]);

  // Fetch columns from Firestore
  useEffect(() => {
    const fetchCols = async () => {
      const docRef = doc(db, "columns", "default");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setColumns(snap.data().columns);
      }
    };
    fetchCols();
  }, []);

  const handleChange = (i, col, value) => {
    const newRows = [...rows];
    newRows[i][col] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, {}]);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Receipt", 14, 10);
    doc.autoTable({
      head: [columns],
      body: rows.map(r => columns.map(c => r[c] || "")),
    });
    doc.save("receipt.pdf");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Receipt Generator</h2>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="border p-2">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {columns.map((col, idx) => (
                  <td key={idx} className="border p-2">
                    <input
                      type="text"
                      value={row[col] || ""}
                      onChange={(e) => handleChange(i, col, e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={addRow} className="bg-blue-500 text-white px-4 py-2 mt-3 rounded">+ Add Row</button>
      <button onClick={generatePDF} className="bg-green-600 text-white px-4 py-2 mt-3 ml-3 rounded">Generate PDF</button>
    </div>
  );
};

export default ReceiptForm;
