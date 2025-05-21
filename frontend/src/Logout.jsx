import { FaSignOutAlt } from "react-icons/fa";
import {useNavigate} from "react-router-dom"
import axios from "axios"
function Logout(){
    const navigate=useNavigate();
    function handleLogoutClick(){
        const logout=async()=>{
            console.log("logout button clicked")
            try{
              const res = await axios.get("http://localhost:3000/logout", {
  withCredentials: true
});
                 window.location.reload();
            }
            catch(err)
            {
                console.log(err);
            }
        }

        logout();
    }

    return(
    <div className="">
    <button onClick={handleLogoutClick} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded">
      <FaSignOutAlt />
      
    </button>
    </div>
    )
}

export default Logout;