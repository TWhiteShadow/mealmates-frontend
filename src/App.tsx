import { Routes, Route } from 'react-router';
import MobileApp from './pages/MobileApp';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Routes>
      <Route index element={< LandingPage />} />
      <Route path='app' element={<MobileApp />} />
    </Routes>

  );
}

export default App;