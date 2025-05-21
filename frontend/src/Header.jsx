import { NavLink } from "react-router-dom";
import { useContext } from "react";
import Context from "./Context";
import { FaUser } from "react-icons/fa";

function Header() {
  const { username, userId } = useContext(Context);

  const activeClass = "underline font-semibold";

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-2xl font-mono text-black">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `hover:underline ${isActive ? activeClass : ""}`
          }
        >
          BloggerBase
        </NavLink>
      </div>
      

      
      <div className="flex items-center space-x-4 text-sm">
        {userId ? (
          <>
            <NavLink
              to="/createPost/:id"
              className={({ isActive }) =>
                `text-black hover:underline ${isActive ? activeClass : ""}`
              }
            >
              Create a Post
            </NavLink>

            <NavLink
              to="/drafts"
              className={({ isActive }) =>
                `text-black hover:underline ${isActive ? activeClass : ""}`
              }
            >
              Drafts
            </NavLink>

            <FaUser size={20} />
            <div className="font-medium">{username}</div>
          </>
        ) : (
          <>
            <NavLink
              to="/loginPage"
              className={({ isActive }) =>
                `text-black hover:underline ${isActive ? activeClass : ""}`
              }
            >
              Login
            </NavLink>

            <NavLink
              to="/registerPage"
              className={({ isActive }) =>
                `text-black hover:underline ${isActive ? activeClass : ""}`
              }
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
