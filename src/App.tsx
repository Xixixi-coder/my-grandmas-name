import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ArchaeologyFlow } from './pages/ArchaeologyFlow';
import { CompletionMode } from './pages/CompletionMode';
import { OutputPage } from './pages/OutputPage';

const basename = import.meta.env.BASE_URL;

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/flow" element={<ArchaeologyFlow />} />
        <Route path="/completion" element={<CompletionMode />} />
        <Route path="/output" element={<OutputPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
