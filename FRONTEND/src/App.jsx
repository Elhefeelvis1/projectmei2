import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/AuthComps/CheckAuth.jsx"
import { AuthProvider } from './components/AuthComps/CheckAuth.jsx';
import Home from "./pages/HomePage.jsx";
import Login from "./pages/Login.jsx";
import UserDetails from "./pages/UserDetails.jsx";
import Messages from "./pages/Messages.jsx";
import MakePost from "./pages/MakePost.jsx";
import ItemListPage from "./pages/ItemListPage.jsx";
import AdminDashboard from "./admin/pages/Dashboard.jsx";
import Pickups from "./pages/Pickups.jsx";


function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userDetails" element={
          <ProtectedRoute>
            <UserDetails />
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="/makePost" element={
          <ProtectedRoute>
            <MakePost />
          </ProtectedRoute>
        } />
        <Route path="/itemList" element={
          <ProtectedRoute>
            <ItemListPage />
          </ProtectedRoute>
        } />
        <Route path="/adminDashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/Pickups" element={
          <ProtectedRoute>
            <Pickups />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
  )
}

export default App;