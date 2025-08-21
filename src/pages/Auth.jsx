import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };

  const googleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Receiptify Login</h2>
        <input className="w-full p-2 mb-2 border rounded" placeholder="Email"
          onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full p-2 mb-2 border rounded" placeholder="Password" type="password"
          onChange={(e) => setPassword(e.target.value)} />
        <button onClick={login} className="w-full bg-blue-600 text-white p-2 rounded mb-2">Login</button>
        <button onClick={signup} className="w-full bg-green-600 text-white p-2 rounded mb-2">Signup</button>
        <button onClick={googleLogin} className="w-full bg-red-500 text-white p-2 rounded">Login with Google</button>
      </div>
    </div>
  );
}
