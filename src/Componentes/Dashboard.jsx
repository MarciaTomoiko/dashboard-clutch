import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [jogos, setJogos] = useState([]);
  const [jogoSelecionado, setJogoSelecionado] = useState('');
  const [fraseAleatoria, setFraseAleatoria] = useState('');
  const [dadosLocais, setDadosLocais] = useState([]);
  const [graphLocal, setGraphLocal] = useState(null);
  const [graphHistorico, setGraphHistorico] = useState(null);

  useEffect(() => {
    const fitData = localStorage.getItem('fit_data');
    if (!fitData) return navigate('/');

    const { average_heart_rate, average_blood_pressure } = JSON.parse(fitData);
    const dados = {
      heart_rate: average_heart_rate || null,
      blood_pressure: {
        systolic: average_blood_pressure?.systolic || null,
        diastolic: average_blood_pressure?.diastolic || null,
      },
      date: new Date().toISOString(),
    };

    const stored = JSON.parse(localStorage.getItem('historical_data')) || [];
    const atualizados = [dados, ...stored.slice(0, 2)];
    localStorage.setItem('historical_data', JSON.stringify(atualizados));
    setDadosLocais(atualizados);

    const filtrados = atualizados.filter(item => !isNaN(Date.parse(item.date)));

    const labels = filtrados.map(item =>
      new Date(item.date).toLocaleString([], {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    );

    setGraphLocal({
      labels,
      datasets: [
        {
          label: 'Frequência Cardíaca (bpm)',
          data: filtrados.map(i => i.heart_rate),
          borderColor: '#f0ce0f',
          backgroundColor: 'rgba(240, 206, 15, 0.3)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
        },
        {
          label: 'Sistólica',
          data: filtrados.map(i => i.blood_pressure?.systolic),
          borderColor: '#FF4D4D',
          backgroundColor: 'rgba(255, 77, 77, 0.3)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
        },
        {
          label: 'Diastólica',
          data: filtrados.map(i => i.blood_pressure?.diastolic),
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.3)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
        },
      ],
    });
  }, [navigate]);

  useEffect(() => {
    fetch('http://localhost:8000/jogos')
      .then((res) => res.json())
      .then((data) => {
        setJogos(data);
        // Se já tiver algum jogo selecionado, atualiza a frase
        if (data.length > 0) {
          const jogoDefault = data[0];
          setJogoSelecionado(jogoDefault.id);
          setFraseAleatoria(getFraseAleatoria(jogoDefault.frases));
        }
      })
      .catch((err) => console.error('Erro ao buscar jogos:', err));
  }, []);

  // Atualiza a frase toda vez que o jogoSelecionado mudar
  useEffect(() => {
  if (!jogoSelecionado || !jogos.length) return;

  const jogo = jogos.find(j => j.id === parseInt(jogoSelecionado));
  if (!jogo || !jogo.frases || !Array.isArray(jogo.frases)) return;

  const frase = getFraseAleatoria(jogo.frases);
  setFraseAleatoria(frase);
}, [jogoSelecionado, jogos]);


  const getFraseAleatoria = (frases) => {
    if (!frases || frases.length === 0) return '';
    const idx = Math.floor(Math.random() * frases.length);
    return frases[idx];
  };

  useEffect(() => {
    const googleId = localStorage.getItem('googleId');
    if (!googleId) {
      console.warn('Google ID não encontrado no localStorage, redirecionando para login.');
      navigate('/');
      return;
    }

    const url = new URL('http://localhost:8000/dados-historicos');
    url.searchParams.append('googleId', googleId);
    if (jogoSelecionado) url.searchParams.append('jogo', jogoSelecionado);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.warn('Dados inválidos:', data);
          return;
        }

        const map = {};
        data.forEach((item) => {
          const date = new Date(item.data);
          if (!isNaN(date)) {
            const key = date.toISOString().split('T')[0];
            map[key] = item;
          }
        });

        const ultimos7Dias = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const isoKey = d.toISOString().split('T')[0];
          const label = d.toLocaleDateString('pt-BR');

          const dia = map[isoKey] || {
            frequencia_cardiaca: null,
            pressao_sistolica: null,
            pressao_diastolica: null,
          };

          ultimos7Dias.push({
            label: label ?? 'Sem data',
            frequencia_cardiaca: typeof dia.frequencia_cardiaca === 'number' ? dia.frequencia_cardiaca : null,
            pressao_sistolica: typeof dia.pressao_sistolica === 'number' ? dia.pressao_sistolica : null,
            pressao_diastolica: typeof dia.pressao_diastolica === 'number' ? dia.pressao_diastolica : null,
          });
        }

        setGraphHistorico({
          labels: ultimos7Dias.map(d => d.label),
          datasets: [
            {
              label: 'Frequência Cardíaca (bpm)',
              data: ultimos7Dias.map(d => d.frequencia_cardiaca),
              borderColor: '#f0ce0f',
              backgroundColor: 'rgba(245, 196, 3, 0.3)',
              fill: true,
              tension: 0.4,
              pointRadius: 3,
            },
            {
              label: 'Sistólica',
              data: ultimos7Dias.map(d => d.pressao_sistolica),
              borderColor: '#FF4D4D',
              backgroundColor: 'rgba(255, 77, 77, 0.3)',
              fill: true,
              tension: 0.4,
              pointRadius: 3,
            },
            {
              label: 'Diastólica',
              data: ultimos7Dias.map(d => d.pressao_diastolica),
              borderColor: '#3498db',
              backgroundColor: 'rgba(245, 6, 6, 0.3)',
              fill: true,
              tension: 0.4,
              pointRadius: 3,
            },
          ],
        });
      })
      .catch((err) => console.error('Erro ao buscar dados históricos:', err));
  }, [jogoSelecionado, navigate]);

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad',
    },
    plugins: {
      legend: {
        labels: {
          color: '#f0f0f0',
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      x: {
        ticks: { color: '#ddd' },
        grid: { color: 'rgba(255, 230, 3, 0.1)' },
      },
      y: {
        ticks: { color: '#ddd' },
        grid: { color: 'rgba(255, 230, 8, 0.1)' },
      },
    },
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Bem vindo ao Clutch Monitor!</h1>

      <div className="dashboard-grid">
        <section className="chart-section">
          <h2>Monitoramento Atual (Última 1 Hora)</h2>
          {graphLocal ? (
            <Line data={graphLocal} options={chartOptions} />
          ) : (
            <p>Carregando gráfico local...</p>
          )}
        </section>

        <section className="chart-section">
          <h2>Relatório de 7 Dias</h2>

          <label>
            Filtrar por jogo:
            <select
              value={jogoSelecionado}
              onChange={(e) => setJogoSelecionado(e.target.value)}
            >
              {jogos.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nome}
                </option>
              ))}
            </select>
          </label>

          {/* Exibir frase aleatória do jogo selecionado */}
          {fraseAleatoria && (
            <p style={{ fontStyle: 'italic', marginTop: '10px', color: '#f0ce0f' }}>
              "{fraseAleatoria}"
            </p>
          )}

          {graphHistorico ? (
            <Line data={graphHistorico} options={chartOptions} />
          ) : (
            <p>Carregando gráfico histórico...</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
