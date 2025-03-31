import { Routes, Route } from 'react-router';
import MobileApp from './pages/MobileApp';
import LandingPage from './pages/LandingPage';
import Connection from './pages/Connection/ConnectPage';
import RegisterPage from './pages/Connection/RegisterPage';
import LoginPage from './pages/Connection/LoginPage';
import DiscoverPage from './pages/DiscoverPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SettingsPage from './pages/Profile/SettingsPage';

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
      <Route path='app/profile' element={<ProfilePage />} />
      <Route path='app/profile/settings' element={<SettingsPage />} />
      <Route path='*' element={<div>404</div>} />
    </Routes>
  );
}

export default App;
