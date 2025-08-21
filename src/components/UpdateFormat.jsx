import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function UpdateFormat() {
  const [columns, setColumns] = useState(["Serial No", "Product", "Price", "Qty"]);
  const [newCol, setNewCol] = useState("");

  const addColumn = () => {
    setColumns([...columns, newCol]);
    setNewCol("");
  };

  const saveFormat = async () => {
    await addDoc(collection(db, "receiptFormat"), { columns });
    alert("Format updated!");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Update Receipt Format</h2>
      <ul className="mb-4">{columns.map(c => <li key={c}>{c}</li>)}</ul>
      <input type="text" value={newCol} onChange={e => setNewCol(e.target.value)} className="border p-2 mr-2"/>
      <button onClick={addColumn} className="bg-green-500 px-3 py-1 text-white rounded">+ Add Column</button>
      <br /><br />
      <button onClick={saveFormat} className="bg-blue-500 px-3 py-1 text-white rounded">Save Format</button>
    </div>
  );
}
