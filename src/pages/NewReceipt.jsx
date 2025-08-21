import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, collection, addDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function NewReceipt() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([{ }]);

  useEffect(() => {
    const formatRef = doc(db, "settings", "receiptFormat");
    const unsub = onSnapshot(formatRef, (snap) => {
      if (snap.exists()) setColumns(snap.data().columns);
    });
    return () => unsub();
  }, []);

  const updateCell = (rowIdx, col, value) => {
    const newRows = [...rows];
    newRows[rowIdx][col] = value;
    setRows(newRows);
  };

  const addRow = () => setRows([...rows, {}]);

  const saveReceipt = async () => {
    await addDoc(collection(db, "receipts"), { rows, createdAt: new Date() });
    generatePDF();
  };

  const generatePDF = () => {
    const docu = new jsPDF();
    docu.text("Receipt", 14, 16);
    const tableData = rows.map((r) => columns.map((c) => r[c] || ""));
    docu.autoTable({ head: [columns], body: tableData });
    docu.save("receipt.pdf");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">New Receipt</h2>
      <table className="w-full border">
        <thead>
          <tr>{columns.map((c, i) => <th key={i} className="border p-2">{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, rowIdx) => (
            <tr key={rowIdx}>
              {columns.map((c, colIdx) => (
                <td key={colIdx} className="border p-2">
                  <input className="w-full"
                    value={r[c] || ""}
                    onChange={(e) => updateCell(rowIdx, c, e.target.value)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 space-x-2">
        <button onClick={addRow} className="bg-gray-500 text-white px-4 py-2 rounded">Add Row</button>
        <button onClick={saveReceipt} className="bg-green-600 text-white px-4 py-2 rounded">Save & Download PDF</button>
      </div>
    </div>
  );
}
