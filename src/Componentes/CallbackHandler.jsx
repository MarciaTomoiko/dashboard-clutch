import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function CallbackHandler() {
  const navigate = useNavigate();
  const hasRun = useRef(false); // ← Isso evita execuções múltiplas

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const google_id = params.get('google_id');
    const heartRate = params.get('hr');
    const systolic = params.get('bp_systolic');
    const diastolic = params.get('bp_diastolic');

    const googleId = params.get('gid');
if (token && heartRate && systolic && diastolic && googleId) {
  localStorage.setItem('googleId', googleId); // ← Agora você salva
  localStorage.setItem('fit_token', token);
  localStorage.setItem('fit_data', JSON.stringify({
    average_heart_rate: heartRate,
    average_blood_pressure: { systolic, diastolic }
  }));

  navigate('/select-game');
} else {
  console.error('Parâmetros ausentes!');
  navigate('/');
}
  }, [navigate]);

  return (
    <div>
      <h1>Carregando...</h1>
    </div>
  );
}

export default CallbackHandler;
