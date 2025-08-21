// src/App.jsx
import React from "react";
import ReceiptForm from "./components/ReceiptForm";
import AdminPanel from "./components/AdminPanel";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-center text-3xl font-bold p-6">Receipt Generator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <ReceiptForm />
        <AdminPanel />
      </div>
    </div>
  );
}

export default App;
