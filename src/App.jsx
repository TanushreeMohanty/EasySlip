// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { auth, db, googleProvider } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import "jspdf-autotable";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  if (!user) return <Landing />;

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-receipt" element={<NewReceipt />} />
        <Route path="/manage-columns" element={<ManageColumns />} />
      </Routes>
    </Router>
  );
}

/* ---------------- LANDING PAGE ---------------- */
function Landing() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    await signInWithPopup(auth, googleProvider);
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
      <h1 className="text-3xl font-bold mb-6">ReceiptEase</h1>
      <button
        onClick={handleGoogleLogin}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}

/* ---------------- NAVBAR ---------------- */
function Navbar({ user }) {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center p-4 bg-purple-600 text-white">
      <h1 className="font-bold">ReceiptEase</h1>
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/new-receipt">New Receipt</Link>
        <Link to="/manage-columns">Manage Columns</Link>
        <button
          onClick={() => signOut(auth)}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

/* ---------------- HOME PAGE ---------------- */
function Home() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Welcome to ReceiptEase</h2>
      <p className="text-gray-700">Choose an option from the navbar above.</p>
    </div>
  );
}

/* ---------------- MANAGE COLUMNS ---------------- */
function ManageColumns() {
  const [columns, setColumns] = useState([]);
  const [newCol, setNewCol] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "columns"), (snap) => {
      setColumns(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const addColumn = async () => {
    if (!newCol.trim()) return;
    await addDoc(collection(db, "columns"), { name: newCol });
    setNewCol("");
  };

  const deleteColumn = async (id) => {
    await deleteDoc(doc(db, "columns", id));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Receipt Columns</h2>
      <div className="flex gap-2 mb-4">
        <input
          value={newCol}
          onChange={(e) => setNewCol(e.target.value)}
          className="border p-2 rounded"
          placeholder="New Column Name"
        />
        <button onClick={addColumn} className="bg-green-600 text-white px-3 rounded">
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {columns.map((col) => (
          <li key={col.id} className="flex justify-between bg-gray-100 p-2 rounded">
            {col.name}
            <button onClick={() => deleteColumn(col.id)} className="text-red-600">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- NEW RECEIPT ---------------- */
function NewReceipt() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([{ id: Date.now() }]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "columns"), (snap) => {
      setColumns(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const updateRow = (id, col, val) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [col]: val } : r))
    );
  };

  const addRow = () => setRows([...rows, { id: Date.now() }]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const colNames = columns.map((c) => c.name);
    const rowData = rows.map((r) => colNames.map((col) => r[col] || ""));
    doc.text("Receipt", 14, 10);
    doc.autoTable({ head: [colNames], body: rowData, startY: 20 });
    doc.save("receipt.pdf");
  };

  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Generate New Receipt</h2>
      <table className="w-full border mb-4 text-sm">
        <thead className="bg-purple-200">
          <tr>
            {columns.map((c) => (
              <th key={c.id} className="border p-2">{c.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              {columns.map((c) => (
                <td key={c.id} className="border p-2">
                  <input
                    value={r[c.name] || ""}
                    onChange={(e) => updateRow(r.id, c.name, e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-4">
        <button onClick={addRow} className="bg-blue-600 text-white px-3 py-1 rounded">
          Add Row
        </button>
        <button onClick={generatePDF} className="bg-green-600 text-white px-3 py-1 rounded">
          Generate PDF
        </button>
      </div>
    </div>
  );
}

export default App;
