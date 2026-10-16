import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Components/User/Home';
import Products from './Components/User/Products';
import SellEwaste from './Components/User/SellEwaste';
import About from './Components/User/About';
import Cart from './Components/User/Cart';
import Profile from './Components/User/Profile';
import OrderTracking from './Components/User/OrderTracking';
import AdminDashboard from './Components/Admin/Dashboard';
import SellRequestsReview from './Components/Admin/SellRequests';
import AdminOrders from './Components/Admin/Orders';

import AdminProducts from './Components/Admin/Products'
import RecyclingCenter from './Components/Admin/RecyclingCenter'
import AdminUsers from './Components/Admin/Users'
import AdminEmployees from './Components/Admin/Employees'
import AdminDesignations from './Components/Admin/Designation'
import AdminRoles from './Components/Admin/Role'
import EmployeeDashboard from './Components/Employee/Dashboard'
import AssignedTasks from './Components/Employee/AssignedTasks'
import ProtectedRoute from './Components/ProtectedRoute'
import RecycleDashboard from "./Components/RecycleCenter/Dashboard";
import ReceivedItems from "./Components/RecycleCenter/ReceivedItems";
import TechnicianItems from "./Components/RecycleCenter/TechnicianItems";
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
      <Route path="/Admin" element={<ProtectedRoute role="admin"><AdminDashboard/></ProtectedRoute>}></Route>
      <Route path="/Admin/SellRequests" element={<ProtectedRoute role="admin"><SellRequestsReview/></ProtectedRoute>}></Route>
      <Route path="/Admin/orders" element={<ProtectedRoute role="admin"><AdminOrders/></ProtectedRoute>}></Route>
      <Route path="/Admin/products" element={<ProtectedRoute role="admin"><AdminProducts/></ProtectedRoute>}></Route>
      <Route path="/Admin/recycling-center" element={<ProtectedRoute role="admin"><RecyclingCenter/></ProtectedRoute>}></Route>
      <Route path="/Admin/Users" element={<ProtectedRoute role="admin"><AdminUsers/></ProtectedRoute>}></Route>
      <Route path="/Admin/Employees" element={<ProtectedRoute role="admin"><AdminEmployees/></ProtectedRoute>}></Route>
      <Route path="/Admin/Designations" element={<ProtectedRoute role="admin"><AdminDesignations/></ProtectedRoute>}></Route>
      <Route path="/Admin/Roles" element={<ProtectedRoute role="admin"><AdminRoles/></ProtectedRoute>}></Route>
      <Route path="/Employee" element={<EmployeeDashboard/>}></Route>
      <Route path="/Employee/tasks" element={<AssignedTasks/>}></Route>
      <Route path="/recycle" element={<RecycleDashboard/>}></Route>
      <Route path="/recycle/items" element={<ReceivedItems/>}></Route>
      <Route path="/recycle/technician" element={<ProtectedRoute role="technician"><TechnicianItems/></ProtectedRoute>}></Route>
    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
