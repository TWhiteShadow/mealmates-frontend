import { Routes, Route, Outlet, useNavigate, useLocation } from 'react-router';
import MobileApp from './pages/MobileApp';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';

import './App.css';
import Connection from './pages/Connection/ConnectPage';
import RegisterPage from './pages/Connection/RegisterPage';
import LoginPage from './pages/Connection/LoginPage';
import DiscoverPage from './pages/DiscoverPage';
import BrowsePage from './pages/BrowsePage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SettingsPage from './pages/Profile/SettingsPage';
import SellPage from './pages/SellPage';
import Navbar from "@/components/ui/Navbar";
import { useEffect } from 'react';
import { navigationRef, locationRef } from './utils/navigateRef';
import MessagesPage from './pages/MessagesPage';
import { useDocumentTitle } from './hooks/use-document-title';
import ProtectedRoute from './components/ProtectedRoute';

function NavbarLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  useDocumentTitle();

  useEffect(() => {
    navigationRef.navigate = navigate;
    locationRef.location = location.pathname;
  }, [navigate, location]);

  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path='app' element={<MobileApp />} />
      <Route path='app/login' element={<Connection />} />
      <Route path='app/login/register' element={<RegisterPage />} />
      <Route path='app/login/login' element={<LoginPage />} />
      <Route path='auth-callback' element={<AuthCallbackPage />} />
      <Route element={<NavbarLayout />}>
        <Route path='app/discover' element={<DiscoverPage />} />
        <Route path='app/browse' element={<BrowsePage />} />
        <Route path='app/profile' element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path='app/profile/settings' element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
        <Route path='app/product/:id' element={<ProductPage />} />
        <Route path='app/sell' element={
          <ProtectedRoute>
            <SellPage />
          </ProtectedRoute>
        } />
        <Route path='app/messages' element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        } />
      </Route>
      <Route path='*' element={<div>404</div>} />
    </Routes>
  );
}

export default App;
