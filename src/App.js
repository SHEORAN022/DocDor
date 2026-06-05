

// export default App;
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Register from './pages/Register';

// Main Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Admins from './pages/Admins';
import Categories from './pages/Categories';
import Symptoms from './pages/Symptoms';
import Doctors from './pages/Doctors';
import OnlineSymptoms from './pages/OnlineSymptoms';
import Appointments from './pages/Appointments';
import FeaturedServices from './pages/FeaturedServices';
import Offers from './pages/Offers';
import Payments from './pages/Payments';
import Users from './pages/Users'; 

// Pet Management
import PetCategoriesPage from "./pages/PetCategoriesPage";
import PetProducts from './pages/PetProducts';
import PetOrders from './pages/PetOrders';

// Lab Management
import LabCategories from "./pages/LabCategories";
import LabTests from "./pages/LabTests";
import CheckupTypes from "./pages/CheckupTypes";
import LabBookings from './pages/LabBookings';
import LoginHistory from './pages/LoginHistory';
// Medicines Management
import Medicines from './pages/Medicines';
import MedicineItems from './pages/MedicineItems';
import SubCategory from './pages/SubCategory';
import MedicineOrders from './pages/MedicineOrders';
import PharmacyLoginHistory from './pages/PharmacyLoginHistory';
// Health Management
import HealthPackageCategories from './pages/HealthPackageCategories';
import HealthPackages from './pages/HealthPackages';

// Surgery Management
import SurgeryCategories from './pages/SurgeriesCategories';
import Surgeries from './pages/Surgeries';

// Settings
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Register />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes with Layout */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
              
              {/* Main Section */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admins" element={<Admins />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/symptoms" element={<Symptoms />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/online-symptoms" element={<OnlineSymptoms />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/featured-services" element={<FeaturedServices />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/users" element={<Users />} /> 
              
              
              {/* Pet Management Section */}
              <Route path="/pet-categories" element={<PetCategoriesPage />} />
              <Route path="/pet-products" element={<PetProducts />} />
              <Route path="/pet-orders" element={<PetOrders />} />
              
              {/* Lab Management Section */}
              <Route path="/lab-categories" element={<LabCategories />} />
              <Route path="/lab-tests" element={<LabTests />} />
              <Route path="/checkup-types" element={<CheckupTypes />} />
              <Route path="/lab-bookings" element={<LabBookings />} />
              <Route path="/login-history" element={<LoginHistory />} />
              <Route path="/pharmacy-login-history" element={<PharmacyLoginHistory />} />
              {/* Medicines Management Section */}
              <Route path="/medicines" element={<Medicines />} />
              <Route path="/medicine-items" element={<MedicineItems />} />
              <Route path="/subcategories" element={<SubCategory />} />
              <Route path="/medicine-orders" element={<MedicineOrders />} />
              
              {/* Health Management Section */}
              <Route path="/health-package-categories" element={<HealthPackageCategories />} />
              <Route path="/health-packages" element={<HealthPackages />} />
              
              {/* Surgery Management Section */}
              <Route path="/surgery-categories" element={<SurgeryCategories />} />
              <Route path="/surgeries" element={<Surgeries />} />
              
              {/* System Section */}
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;