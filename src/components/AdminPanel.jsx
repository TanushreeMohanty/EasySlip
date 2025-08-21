// src/components/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const AdminPanel = () => {
  const [columns, setColumns] = useState([]);
  const [newCol, setNewCol] = useState("");

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

  const addColumn = async () => {
    if (!newCol) return;
    const docRef = doc(db, "columns", "default");
    await updateDoc(docRef, { columns: [...columns, newCol] });
    setColumns([...columns, newCol]);
    setNewCol("");
  };

  const deleteColumn = async (col) => {
    const updated = columns.filter(c => c !== col);
    const docRef = doc(db, "columns", "default");
    await updateDoc(docRef, { columns: updated });
    setColumns(updated);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <ul>
        {columns.map((c, i) => (
          <li key={i} className="flex justify-between p-2 border mb-2">
            {c}
            <button onClick={() => deleteColumn(c)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="New Column"
        value={newCol}
        onChange={(e) => setNewCol(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <button onClick={addColumn} className="bg-blue-500 text-white px-4 py-2 rounded">Add Column</button>
    </div>
  );
};

export default AdminPanel;
