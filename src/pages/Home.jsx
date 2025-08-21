import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex justify-between items-center p-4 bg-blue-700 text-white">
        <h1 className="text-xl font-bold">Receiptify</h1>
        <button onClick={() => signOut(auth)} className="bg-red-500 px-4 py-1 rounded">Logout</button>
      </nav>

      <div className="flex flex-col items-center mt-10 space-y-4">
        <Link to="/new" className="px-4 py-2 bg-green-600 text-white rounded shadow">Generate New Receipt</Link>
        <Link to="/records" className="px-4 py-2 bg-blue-600 text-white rounded shadow">View Previous Records</Link>
        <Link to="/format" className="px-4 py-2 bg-purple-600 text-white rounded shadow">Update Receipt Format</Link>
      </div>
    </div>
  );
}
