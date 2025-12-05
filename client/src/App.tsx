import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CreateRFP } from './pages/CreateRFP';
import { Dashboard } from './pages/Dashboard';
import { Comparison } from './pages/Comparision';
import { VendorManager } from './pages/VendorManager'; // Assume simple form similar to CreateRFP

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateRFP />} />
          <Route path="/vendors" element={<VendorManager />} />
          <Route path="/compare/:id" element={<Comparison />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;