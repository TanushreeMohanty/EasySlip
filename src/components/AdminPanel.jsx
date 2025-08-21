import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

const AdminPanel = () => {
  const [columns, setColumns] = useState([]);
  const [newCol, setNewCol] = useState("");

  useEffect(() => {
    const fetchCols = async () => {
      const docRef = doc(db, "columns", "default");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setColumns(snap.data().columns);
      } else {
        // create with default columns if not exists
        await setDoc(docRef, { columns: ["Serial No", "Product", "Price", "Qty"] });
        setColumns(["Serial No", "Product", "Price", "Qty"]);
      }
    };
    fetchCols();
  }, []);

  const addColumn = async () => {
    if (!newCol.trim()) return;
    const updated = [...columns, newCol.trim()];
    const docRef = doc(db, "columns", "default");
    await updateDoc(docRef, { columns: updated });
    setColumns(updated);
    setNewCol("");
  };

  const deleteColumn = async (col) => {
    const updated = columns.filter(c => c !== col);
    const docRef = doc(db, "columns", "default");
    await updateDoc(docRef, { columns: updated });
    setColumns(updated);
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <ul className="mb-4">
        {columns.map((c, i) => (
          <li key={i} className="flex justify-between items-center border p-2 mb-2 rounded">
            {c}
            <button
              onClick={() => deleteColumn(c)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New Column"
          value={newCol}
          onChange={(e) => setNewCol(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button onClick={addColumn} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
