import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Context from "./Context";
import axios from "axios";

export default function RegisterPage() {
  const [user, setUserRegister] = useState({ userName: "", password: "" });
  const { setUser } = useContext(Context);
  const [hidePassword, setHidePassword] = useState(true);
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setUserRegister(prev => ({ ...prev, [name]: value }));
  }

  function handleRegister(e) {
  e.preventDefault();

  const registerUser = async () => {
    try {
      const res = await axios.post("http://localhost:3000/register", user,{withCredentials:true});

      const data= res.data;
      console.log(data)
      
      setUser({
        userName: data.data.userName,
        userId: data.data.id,
      });
      
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setNotification("User already exists");

        setTimeout(() => {
          console.log("setTimeout triggered");
          setNotification("");
          navigate("/loginPage");
        }, 3000);
      } else {
        console.error("Registration failed:", error);
      }
    }
  };

  registerUser(); 
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Register
        </h1>

        

        <form onSubmit={handleRegister} className="flex flex-col space-y-5">
          <input
            type="text"
            name="userName"
            value={user.userName}
            onChange={handleChange}
            placeholder="Username"
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="relative">
            <input
              type={hidePassword ? "password" : "text"}
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setHidePassword(!hidePassword)}
              className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
              aria-label={hidePassword ? "Show password" : "Hide password"}
            >
              {hidePassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="min-h-[10px] mb-4">
          {notification && (
            <div className="text-sm text-center text-red-600 font-medium bg-red-100 p-2 rounded min-w-[250px]">
              {notification}
            </div>
          )}
        </div>
          <button
            type="submit"
            className="bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors duration-200"
          >
            Register
          </button>
        </form>

        <div
          onClick={() => navigate("/loginPage")}
          className="mt-4 text-center text-sm text-blue-600 hover:underline cursor-pointer"
        >
          Already have an account? Login
        </div>
      </div>
    </div>
  );
}
