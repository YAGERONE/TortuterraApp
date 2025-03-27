// src/utils/api.ts
import { useState, useEffect, useCallback } from 'react';

// Dirección de nuestro servidor puente
const API_URL = 'https://tortuterra-bridge.onrender.com';

// Temas MQTT (solo para referencia, no se usan directamente)
export const MQTT_TOPICS = {
  TEMPERATURE: 'tortuterra/sensor/temperature',
  FOOD_LEVEL: 'tortuterra/sensor/foodlevel',
  MOTION: 'tortuterra/sensor/motion',
  FAN_STATE: 'tortuterra/fan/state',
  FAN_CONTROL: 'tortuterra/fan/control',
  LAMP_STATE: 'tortuterra/lamp/state',
  LAMP_CONTROL: 'tortuterra/lamp/control',
  FOOD_STATE: 'tortuterra/food/state',
  FOOD_CONTROL: 'tortuterra/food/control'
};

// Estado del terrario
interface TerrarioState {
  temperature: number;
  fanState: boolean;
  foodLevel: string;
  turtleActivity: boolean;
  lampState: boolean;
}

// Hook personalizado para manejar la comunicación
export function useTerrarioApi() {
  const [status, setStatus] = useState<TerrarioState>({
    temperature: 25.0,
    fanState: false,
    foodLevel: "medium",
    turtleActivity: false,
    lampState: false
  });
  
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Función para obtener el estado actual
  const fetchStatus = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      const response = await fetch(`${API_URL}/api/status`);
      
      if (!response.ok) {
        throw new Error('Error al obtener el estado');
      }
      
      const data = await response.json();
      setStatus(data);
      setConnectionStatus('connected');
      setErrorMessage(null);
      return data;
    } catch (error) {
      console.error('Error:', error);
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
      return null;
    }
  }, []);

  // Función para controlar el ventilador
  const controlFan = useCallback(async (state: boolean) => {
    try {
      const response = await fetch(`${API_URL}/api/fan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state }),
      });
      
      if (!response.ok) {
        throw new Error('Error al controlar el ventilador');
      }
      
      // Actualizar estado después de controlar el ventilador
      fetchStatus();
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }, [fetchStatus]);

  // Función para controlar la lámpara
  const controlLamp = useCallback(async (state: boolean) => {
    try {
      const response = await fetch(`${API_URL}/api/lamp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state }),
      });
      
      if (!response.ok) {
        throw new Error('Error al controlar la lámpara');
      }
      
      // Actualizar estado después de controlar la lámpara
      fetchStatus();
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }, [fetchStatus]);

  // Función para dispensar comida
  const dispenseFood = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/food`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al dispensar comida');
      }
      
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }, []);

  // Función para conectar (obtener estado inicial)
  const connect = useCallback(async () => {
    return await fetchStatus();
  }, [fetchStatus]);

  // Iniciar la conexión al montar el componente
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchStatus();
    }, 5000); // Actualizar cada 5 segundos
    
    // Obtener estado inicial
    fetchStatus();
    
    // Limpiar al desmontar
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchStatus]);

  return {
    status,
    connectionStatus,
    errorMessage,
    connect,
    controlFan,
    controlLamp,
    dispenseFood
  };
}