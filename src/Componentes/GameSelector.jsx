import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameSelector.css'; // Certifique-se de importar o CSS

function GameSelector() {
  const [jogoSelecionado, setJogoSelecionado] = useState('1');
  const [token, setToken] = useState(null);
  const [frequencia_cardiaca, setFrequenciaCardiaca] = useState(null);
  const [pressao_sistolica, setPressaoSistolica] = useState(null);
  const [pressao_diastolica, setPressaoDiastolica] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fit_data = JSON.parse(localStorage.getItem('fit_data'));
    const fit_token = localStorage.getItem('fit_token');

    setFrequenciaCardiaca(fit_data?.average_heart_rate);
    setPressaoSistolica(fit_data?.average_blood_pressure?.systolic);
    setPressaoDiastolica(fit_data?.average_blood_pressure?.diastolic);

    if (fit_token) {
      setToken(fit_token);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleGameSelection = async () => {
    if (token) {
      const response = await fetch('http://localhost:8000/save-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          jogoSelecionado,
          frequencia_cardiaca,
          pressao_sistolica,
          pressao_diastolica
        }),
      });

      if (response.ok) {
        navigate('/dashboard');
      } else {
        console.error('Erro ao salvar o jogo');
      }
    }
  };

  return (
    <div className="game-selector-container">
      <h2>Selecione seu jogo</h2>
      <select
        className="game-select"
        value={jogoSelecionado}
        onChange={(e) => setJogoSelecionado(e.target.value)}
      >
        <option value="1">League of Legends</option>
        <option value="2">Valorant</option>
        <option value="3">Counter-Strike</option>
        <option value="4">Fortnite</option>
        <option value="5">Genshi Impact</option>
        <option value="6">Monster Hunter</option>
        <option value="7">Marvel Rivals</option>
      </select>

      <button className="confirm-button" onClick={handleGameSelection}>
        Salvar e ir para o Dashboard
      </button>
    </div>
  );
}

export default GameSelector;
