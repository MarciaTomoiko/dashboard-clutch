import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Componentes/LoginPage';      // Página de login
import CallbackHandler from './Componentes/CallbackHandler';  // Página de redirecionamento
import Dashboard from './Componentes/Dashboard'; // Dashboard
import GameSelector from './Componentes/GameSelector'; //Seleção de jogos

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />       {/* Rota inicial */}
        <Route path="/callback" element={<CallbackHandler />} />  {/* Rota de callback */}
        <Route path="/dashboard" element={<Dashboard />} />  {/* Dashboard */}
        <Route path="/select-game" element={<GameSelector />} /> {/* Seleção de jogos */}
      </Routes>
    </Router>
  );
}

export default App;
