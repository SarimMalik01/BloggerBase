import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Content from "./Content";
import CreatePost from "./CreatePost"; 
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Drafts from "./Drafts";
import ViewPost from "./ViewPost";
import Context from "./Context"
import Logout from "./Logout"


function App() {
  const {userName,userId}=useContext(Context);
  return (
    <div className="Main-section p-7">
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="/createPost/:id" element={<CreatePost />} />
           <Route path="/drafts" element={<Drafts/>} />
          <Route path="/loginPage" element={<LoginPage />} />
          <Route path="/registerPage" element={<RegisterPage />} />
          <Route path="/post/:id" element={<ViewPost />} />
        </Routes>
      </div>
      {userId && 
      <div className="fixed bottom-4 right-4 z-50">
  <Logout />
</div>
}
    </div>
  );
}

export default App;
