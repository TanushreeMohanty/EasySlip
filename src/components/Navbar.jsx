import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between text-white">
      <h1 className="font-bold">EasySlip</h1>
      <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
    </nav>
  );
}
