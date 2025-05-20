import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Context from "./Context";
import axios from "axios";

export default function LoginPage() {
  const [user, setUserLogin] = useState({ userName: "", password: "" });
  const { setUser } = useContext(Context);
  const [hidePassword, setHidePassword] = useState(true);
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setUserLogin(prev => ({ ...prev, [name]: value }));
  }

  function handleLogin(e) {
  e.preventDefault();

  const fetchData = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/login",
        {
          userName: user.userName,
          password: user.password,
        },
        {
          withCredentials: true, 
        }
      );

      const data = res.data.data;
      console.log(data);
      setUser({
        userName: data.userName,
        userId: data.id,
      });

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);

      if (error.response?.status === 401) {
        setNotification("Invalid credentials. Please try again.");
        setTimeout(()=>{
          setNotification("");
        },3000)
      } 
      if(error.response?.status==301){
      setNotification("User not found");
       setTimeout(()=>{
          setNotification("");
           navigate("/registerPage")
        },3000)
     
      }
        else {
        setNotification("Login failed. Please try again.");
      }
    }
  };

  fetchData();
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Login
        </h1>

        

        <form onSubmit={handleLogin} className="flex flex-col space-y-5">
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
            Login
          </button>
        </form>

        <div
          onClick={() => navigate("/registerPage")}
          className="mt-4 text-center text-sm text-blue-600 hover:underline cursor-pointer"
        >
          New to us? Register here
        </div>
      </div>
    </div>
  );
}
