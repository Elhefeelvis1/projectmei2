import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/GlobalComps/Nav.jsx";
import Home from "./pages/HomePage.jsx";
import Login from "./pages/Login.jsx";
import UserDetails from "./pages/UserDetails.jsx";
import Messages from "./pages/Messages.jsx";


function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userDetails" element={<UserDetails />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;