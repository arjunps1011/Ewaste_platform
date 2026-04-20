import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/user/Home';
import Products from './components/user/Products';
import SellEwaste from './components/user/SellEwaste';
import About from './components/user/About';
import Cart from './components/user/Cart';
import Profile from './components/user/Profile';
import OrderTracking from './components/user/OrderTracking';
import AdminDashboard from './components/admin/AdminDashboard';
import SellRequestsReview from './components/admin/SellRequestsReview';
import AdminOrders from './components/admin/AdminOrders';

import AdminProducts from './components/admin/AdminProducts'
import RecyclingCenter from './components/admin/RecyclingCenter'
import AdminUsers from './components/admin/AdminUsers'
import AdminEmployees from './components/admin/AdminEmployees'
import EmployeeDashboard from './components/employee/EmployeeDashboard'
import AssignedTasks from './components/employee/AssignedTasks'
import ProtectedRoute from './components/ProtectedRoute'
import RecycleDashboard from "./components/recycle_center/RecycleDashboard";
import ReceivedItems from "./components/recycle_center/ReceivedItems";
import TechnicianItems from "./components/recycle_center/TechnicianItems";
import './App.css'

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/products" element={<Products/>}></Route>
      <Route path="/sell" element={<SellEwaste/>}></Route>
      <Route path="/about" element={<About/>}></Route>
      <Route path="/cart" element={<Cart/>}></Route>
      <Route path="/profile" element={<Profile/>}></Route>
      <Route path="/order/:id" element={<OrderTracking/>}></Route>
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard/></ProtectedRoute>}></Route>
      <Route path="/admin/sell-requests" element={<ProtectedRoute role="admin"><SellRequestsReview/></ProtectedRoute>}></Route>
      <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminOrders/></ProtectedRoute>}></Route>
      <Route path="/admin/products" element={<ProtectedRoute role="admin"><AdminProducts/></ProtectedRoute>}></Route>
      <Route path="/admin/recycling-center" element={<ProtectedRoute role="admin"><RecyclingCenter/></ProtectedRoute>}></Route>
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers/></ProtectedRoute>}></Route>
      <Route path="/admin/employees" element={<ProtectedRoute role="admin"><AdminEmployees/></ProtectedRoute>}></Route>
      <Route path="/employee" element={<EmployeeDashboard/>}></Route>
      <Route path="/employee/tasks" element={<AssignedTasks/>}></Route>
      <Route path="/recycle" element={<RecycleDashboard/>}></Route>
      <Route path="/recycle/items" element={<ReceivedItems/>}></Route>
      <Route path="/recycle/technician" element={<ProtectedRoute role="technician"><TechnicianItems/></ProtectedRoute>}></Route>
    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
