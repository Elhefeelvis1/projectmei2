import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/AuthComps/CheckAuth.jsx"
import { AuthProvider } from './components/AuthComps/CheckAuth.jsx';
import Home from "./pages/HomePage.jsx";
import Login from "./pages/Login.jsx";
import UserDetails from "./pages/UserDetails.jsx";
import Messages from "./pages/Messages.jsx";
import MakePost from "./pages/MakePost.jsx";
import MyItems from "./pages/MyItems.jsx";
import ItemListPage from "./pages/ItemListPage.jsx";
import AdminDashboard from "./admin/pages/Dashboard.jsx";
import Pickups from "./pages/Pickups.jsx";
import ItemOffers from "./pages/ItemOffers.jsx";
import MyBids from "./pages/MyBids.jsx";
import ItemDetails from "./pages/itemDetails.jsx";


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
          <Route path="/create-post" element={
            <ProtectedRoute>
              <MakePost mode="create" />
            </ProtectedRoute>
          } />
          <Route path="/edit-item/:id" element={
            <ProtectedRoute>
              <MakePost mode="edit" />
            </ProtectedRoute>
          } />
          <Route path="/my-items" element={
            <ProtectedRoute>
              <MyItems />
            </ProtectedRoute>
          } />
          <Route path="/item-offers/:id" element={
            <ProtectedRoute>
              <ItemOffers />
            </ProtectedRoute>
          } />
          <Route path="/my-bids" element={
            <ProtectedRoute>
              <MyBids />
            </ProtectedRoute>
          } />
          <Route path="/itemDetails/:id" element={
            <ProtectedRoute>
              <ItemDetails />
            </ProtectedRoute>
          } />
          <Route path="/itemList" element={
            <ItemListPage />
          } />
          <Route path="/adminDashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/pickups" element={
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