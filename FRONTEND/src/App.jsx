import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage.jsx";
import Login from "./pages/Login.jsx";
import UserDetails from "./pages/UserDetails.jsx";
import Messages from "./pages/Messages.jsx";
import MakePost from "./pages/MakePost.jsx";
import ItemListPage from "./pages/ItemListPage.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userDetails" element={<UserDetails />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/makePost" element={<MakePost />} />
        <Route path="/itemList" element={<ItemListPage />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App;