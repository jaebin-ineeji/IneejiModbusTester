import { MonitoringPage } from '@/pages/Monitoring';
import { Settings } from '@/pages/Settings';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<MonitoringPage />} />
        </Routes>
        <ToastContainer position="top-center" />
      </div>
    </Router>
  );
}

export default App;
