import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-6">Welcome to EasySlip</h2>
        <div className="flex flex-col gap-4">
          <Link to="/new" className="bg-blue-500 text-white px-4 py-2 rounded">Generate New Receipt</Link>
          <Link to="/records" className="bg-green-500 text-white px-4 py-2 rounded">Previous Records</Link>
          <Link to="/update" className="bg-purple-500 text-white px-4 py-2 rounded">Update Receipt Format</Link>
        </div>
      </div>
    </div>
  );
}
