import { useEffect, useState } from 'react';
import axios from 'axios';

function HeartData({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para buscar os dados
  const getData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/get-heart-data', {
        params: { token }
      });
      setData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError('Erro ao buscar dados');
    } finally {
      setLoading(false);
    }
  };

  // Chamar a função getData automaticamente assim que o componente for montado e o token estiver disponível
  useEffect(() => {
    if (token) {
      getData(); // Carregar os dados assim que o token estiver disponível
    }
  }, [token]); // Reexecuta quando o token mudar

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dados do Google Fit</h2>
      
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !data && !error && (
        <button onClick={getData}>Buscar Dados</button>
      )}

      {data && (
        <div>
          <h3>Frequência Cardíaca Média: {data.average_heart_rate} BPM</h3>
          {data.average_blood_pressure && (
            <h3>
              Pressão Arterial Média: {data.average_blood_pressure.systolic}/{data.average_blood_pressure.diastolic} mmHg
            </h3>
          )}
        </div>
      )}
    </div>
  );
}

export default HeartData;
