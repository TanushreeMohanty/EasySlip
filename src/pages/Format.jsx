import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";

export default function Format() {
  const [columns, setColumns] = useState([]);
  const formatRef = doc(db, "settings", "receiptFormat");

  useEffect(() => {
    const unsub = onSnapshot(formatRef, (snap) => {
      if (snap.exists()) setColumns(snap.data().columns);
    });
    return () => unsub();
  }, []);

  const addColumn = async () => {
    const newCol = prompt("Enter column name:");
    if (newCol) {
      await updateDoc(formatRef, { columns: [...columns, newCol] });
    }
  };

  const deleteColumn = async (col) => {
    await updateDoc(formatRef, { columns: columns.filter((c) => c !== col) });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Update Receipt Format</h2>
      <ul className="space-y-2">
        {columns.map((col, i) => (
          <li key={i} className="flex justify-between bg-gray-200 p-2 rounded">
            {col}
            <button onClick={() => deleteColumn(col)} className="text-red-500">X</button>
          </li>
        ))}
      </ul>
      <button onClick={addColumn} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Add Column</button>
    </div>
  );
}
