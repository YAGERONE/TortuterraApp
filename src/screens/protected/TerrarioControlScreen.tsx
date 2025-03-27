// src/screens/protected/TerrarioControlScreen.tsx
import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Switch,
  Alert,
  Platform,
  BackHandler
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useTerrarioApi } from "../../utils/api"; // Importamos nuestro hook API

// Interfaz para el estado del terrario
interface TerrarioStatus {
  temperature: number;
  fanState: boolean;
  foodLevel: string;
  turtleActivity: boolean;
  stableTemp: number;
  maxTemp: number;
  lampState: boolean;
}

const TerrarioControlScreen = () => {
  // Estado del terrario
  const [status, setStatus] = useState<TerrarioStatus>({
    temperature: 25.0,
    fanState: false,
    foodLevel: "medium",
    turtleActivity: false,
    stableTemp: 24.0,
    maxTemp: 30.0,
    lampState: false
  });
  
  // Estados de interfaz
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  // Hook API para la comunicación
  const { 
    status: apiStatus, 
    connectionStatus, 
    errorMessage, 
    connect, 
    controlFan, 
    controlLamp, 
    dispenseFood 
  } = useTerrarioApi();
  
  // Referencia al estado de conexión para el UI
  const connected = connectionStatus === 'connected';

  // Actualizar el estado local cuando cambia el estado de la API
  useEffect(() => {
    if (apiStatus) {
      setStatus(prev => ({
        ...prev,
        temperature: apiStatus.temperature,
        fanState: apiStatus.fanState,
        foodLevel: apiStatus.foodLevel,
        turtleActivity: apiStatus.turtleActivity,
        lampState: apiStatus.lampState
      }));
      
      if (connectionStatus === 'connected') {
        setLoading(false);
        setError(null);
      }
    }
  }, [apiStatus, connectionStatus]);

  // Manejar errores de conexión
  useEffect(() => {
    if (connectionStatus === 'error' && errorMessage) {
      setError(`Error de conexión: ${errorMessage}`);
      setLoading(false);
      
      // Incrementar contador de intentos
      setReconnectAttempts(prev => prev + 1);
      
      // Después de algunos intentos, sugerir cambiar de red
      if (reconnectAttempts >= 3) {
        setError('No se puede conectar al servidor. Verifica tu conexión a Internet.');
      }
    }
  }, [connectionStatus, errorMessage, reconnectAttempts]);

  // Reconectar cuando la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {
      if (connectionStatus !== 'connected' && connectionStatus !== 'connecting') {
        setLoading(true);
        connect();
      }
      
      // En Android, manejar el botón de retroceso para mantener la conexión
      if (Platform.OS === 'android') {
        const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
          return false; // Permitir comportamiento por defecto
        });
        
        return () => subscription.remove();
      }
    }, [connectionStatus, connect])
  );

  // Función para refrescar la pantalla
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setError(null);
    
    // Intentar reconectar
    connect().finally(() => {
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    });
  }, [connect]);

  // Controlar ventilador
  const handleFanToggle = useCallback((value: boolean) => {
    if (connected) {
      controlFan(value);
    }
  }, [connected, controlFan]);

  // Controlar lámpara
  const handleLampToggle = useCallback((value: boolean) => {
    if (connected) {
      controlLamp(value);
    }
  }, [connected, controlLamp]);

  // Dispensar comida
  const handleDispenseFood = useCallback(() => {
    if (connected) {
      dispenseFood();
      Alert.alert('Dispensando comida', 'Se ha enviado la orden al dispensador.');
    }
  }, [connected, dispenseFood]);

  // Forzar reconexión manual
  const handleForceReconnect = useCallback(() => {
    setLoading(true);
    setError(null);
    connect();
  }, [connect]);

  // Mostrar pantalla de carga
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#55b96a" />
        <Text style={styles.loadingText}>Conectando con el terrario...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#55b96a"]} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Control del Terrario</Text>
        <Text style={styles.subtitle}>Monitorea y controla el hábitat de tu tortuga</Text>
        
        {/* Indicador de estado de conexión */}
        <View style={styles.connectionContainer}>
          <View style={[styles.connectionIndicator, { backgroundColor: connected ? '#55b96a' : '#ff5252' }]} />
          <Text style={styles.connectionText}>
            {connected ? 'Conectado' : 'Desconectado'}
          </Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.reconnectButton} onPress={handleForceReconnect}>
            <Text style={styles.reconnectButtonText}>Intentar reconectar</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Estado Actual</Text>

        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Ionicons name="thermometer-outline" size={24} color="#55b96a" />
            <Text style={styles.statusLabel}>Temperatura</Text>
            <Text style={styles.statusValue}>{status.temperature.toFixed(1)}°C</Text>
          </View>

          <View style={styles.statusItem}>
            <Ionicons name="water-outline" size={24} color="#55b96a" />
            <Text style={styles.statusLabel}>Nivel de Comida</Text>
            <Text style={styles.statusValue}>
              {status.foodLevel === "empty" ? "Vacío" :
              status.foodLevel === "medium" ? "Medio" :
              status.foodLevel === "full" ? "Lleno" : status.foodLevel}
            </Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Ionicons
              name={status.turtleActivity ? "footsteps-outline" : "bed-outline"}
              size={24} color="#55b96a"
            />
            <Text style={styles.statusLabel}>Actividad</Text>
            <Text style={styles.statusValue}>{status.turtleActivity ? "Activa" : "Inactiva"}</Text>
          </View>

          <View style={styles.statusItem}>
            <Ionicons name="options-outline" size={24} color="#55b96a" />
            <Text style={styles.statusLabel}>Temp. Ideal</Text>
            <Text style={styles.statusValue}>
              {status.stableTemp}°C - {status.maxTemp}°C
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.controlCard}>
        <Text style={styles.controlTitle}>Controles</Text>

        <View style={styles.controlItem}>
          <View style={styles.controlInfo}>
            <Ionicons name="flash-outline" size={28} color="#333" />
            <View>
              <Text style={styles.controlLabel}>Ventilador</Text>
              <Text style={styles.controlStatus}>{status.fanState ? "Encendido" : "Apagado"}</Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: "#e0e0e0", true: "#cce8d0" }}
            thumbColor={status.fanState ? "#55b96a" : "#f4f3f4"}
            onValueChange={handleFanToggle}
            value={status.fanState}
            disabled={!connected}
          />
        </View>

        <View style={styles.controlItem}>
          <View style={styles.controlInfo}>
            <Ionicons name="bulb-outline" size={28} color="#333" />
            <View>
              <Text style={styles.controlLabel}>Lámpara</Text>
              <Text style={styles.controlStatus}>{status.lampState ? "Encendida" : "Apagada"}</Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: "#e0e0e0", true: "#cce8d0" }}
            thumbColor={status.lampState ? "#55b96a" : "#f4f3f4"}
            onValueChange={handleLampToggle}
            value={status.lampState}
            disabled={!connected}
          />
        </View>

        <TouchableOpacity 
          style={[styles.foodButton, !connected && styles.disabledButton]} 
          onPress={handleDispenseFood} 
          disabled={!connected}
        >
          <Ionicons name="fast-food-outline" size={24} color="#fff" />
          <Text style={styles.foodButtonText}>Dispensar Comida</Text>
        </TouchableOpacity>
      </View>
      
      {/* Información de conexión */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Información de Conexión</Text>
        <Text style={styles.infoText}>
          La conexión con el terrario es en tiempo real a través de Internet. 
          Ahora puedes controlar tu terrario desde cualquier red.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5fff7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5fff7",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4b8063",
  },
  errorContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: "#ffebee",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#ff5252",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
    marginBottom: 10,
  },
  reconnectButton: {
    backgroundColor: "#ff5252",
    padding: 8,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  reconnectButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  header: {
    padding: 20,
    backgroundColor: "#e0ffea",
    borderBottomWidth: 1,
    borderBottomColor: "#c3e6cd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e8b57",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#4b8063",
    marginBottom: 10,
  },
  connectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  connectionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  connectionText: {
    fontSize: 14,
    color: "#4b8063",
    fontWeight: "500",
  },
  statusCard: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#c3e6cd",
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e7d52",
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statusItem: {
    alignItems: "center",
    width: "48%",
    backgroundColor: "#f9fffc",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c3e6cd",
  },
  statusLabel: {
    fontSize: 14,
    color: "#5a8a74",
    marginTop: 5,
    marginBottom: 3,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e7d52",
  },
  controlCard: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#c3e6cd",
    marginBottom: 15,
  },
  controlTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e7d52",
    marginBottom: 15,
  },
  controlItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0ffea",
  },
  controlInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2e7d52",
    marginLeft: 12,
  },
  controlStatus: {
    fontSize: 14,
    color: "#5a8a74",
    marginLeft: 12,
  },
  foodButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#18a558",
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  foodButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.7,
  },
  infoCard: {
    backgroundColor: "#f0f7ff",
    margin: 15,
    borderRadius: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#c5d9f1",
    marginBottom: 25,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3a5d8f",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#4a6d9f",
    lineHeight: 20,
  }
});

export default TerrarioControlScreen;