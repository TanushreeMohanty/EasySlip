import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function NewReceipt() {
  const [columns, setColumns] = useState(["Serial No", "Product", "Price", "Qty"]);
  const [rows, setRows] = useState([{ }]);

  useEffect(() => {
    const fetchColumns = async () => {
      const snapshot = await getDocs(collection(db, "receiptFormat"));
      snapshot.forEach(doc => setColumns(doc.data().columns));
    };
    fetchColumns();
  }, []);

  const handleChange = (index, col, value) => {
    const updated = [...rows];
    updated[index][col] = value;
    setRows(updated);
  };

  const addRow = () => setRows([...rows, {}]);

  const generatePDF = async () => {
    const doc = new jsPDF();
    const tableData = rows.map(r => columns.map(c => r[c] || ""));
    doc.autoTable({ head: [columns], body: tableData });
    doc.save("receipt.pdf");
    await addDoc(collection(db, "receipts"), { rows, date: new Date() });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Generate New Receipt</h2>
      <table className="border mb-4 w-full">
        <thead>
          <tr>
            {columns.map(c => <th key={c} className="border px-2">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map(c => (
                <td key={c} className="border">
                  <input type="text" value={row[c] || ""} onChange={e => handleChange(i, c, e.target.value)} className="w-full p-1"/>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow} className="bg-green-500 text-white px-3 py-1 rounded mr-2">+ Add Row</button>
      <button onClick={generatePDF} className="bg-blue-500 text-white px-3 py-1 rounded">Generate PDF</button>
    </div>
  );
}
