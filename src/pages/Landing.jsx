import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/home");
  };

  const signup = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
    navigate("/home");
  };

  const googleLogin = async () => {
    await signInWithPopup(auth, googleProvider);
    navigate("/home");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100">
      <h1 className="text-3xl font-bold mb-4">EasySlip Login</h1>
      <input className="p-2 border mb-2" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input className="p-2 border mb-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login} className="bg-blue-500 text-white px-4 py-2 rounded mb-2">Login</button>
      <button onClick={signup} className="bg-green-500 text-white px-4 py-2 rounded mb-2">Signup</button>
      <button onClick={googleLogin} className="bg-red-500 text-white px-4 py-2 rounded">Login with Google</button>
    </div>
  );
}
