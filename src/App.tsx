import { Routes, Route } from 'react-router';
import MobileApp from './pages/MobileApp';
import LandingPage from './pages/LandingPage';
import Connection from './pages/ConnectPage';

function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path='app' element={<MobileApp />} />
      <Route path='app/login' element={<Connection />} />
      <Route path='*' element={<div>404</div>} />
    </Routes>
  );
}

export default App;
