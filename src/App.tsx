import { Routes, Route } from 'react-router';
import MobileApp from './pages/MobileApp';
import LandingPage from './pages/LandingPage';
import Connection from './pages/ConnectPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import BrowsePage from './pages/BrowsePage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import DiscoverPage from './pages/DiscoverPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path='app' element={<MobileApp />} />
      <Route path='app/login' element={<Connection />} />
      <Route path='app/login/register' element={<RegisterPage />} />
      <Route path='app/login/login' element={<LoginPage />} />
      <Route path='auth-callback' element={<AuthCallbackPage />} />
      <Route path='app/discover' element={<DiscoverPage />} />
      <Route path='app/browse' element={<BrowsePage />} />
      <Route path='*' element={<div>404</div>} />
    </Routes>
  );
}

export default App;
