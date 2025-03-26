"use client"

import { useState, useCallback } from "react"
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
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as api from "../../api/api"
import type { TerrarioStatus } from "../../types"
import { useFocusEffect } from "@react-navigation/native"

const TerrarioControlScreen = () => {
  const [status, setStatus] = useState<TerrarioStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTerrarioStatus = async () => {
    try {
      setLoading(true)
      setError(null)

      // Obtener datos reales desde el backend conectado al ESP32
      const response = await api.getTerrarioStatus()
      setStatus(response.data)

      setLoading(false)
    } catch (error) {
      console.error("Error fetching terrario status:", error)
      setError("Error al obtener el estado del terrario")
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchTerrarioStatus()

      // Set up a timer to refresh the status every 10 seconds (más frecuente para datos en tiempo real)
      const intervalId = setInterval(() => {
        fetchTerrarioStatus()
      }, 10000)

      return () => clearInterval(intervalId)
    }, []),
  )

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchTerrarioStatus()
    setRefreshing(false)
  }

  const handleFanToggle = async (value: boolean) => {
    try {
      setError(null)
      await api.controlActuator({ actuador: "fan", accion: value ? "on" : "off" })

      // Actualizamos el estado local para reflejar el cambio inmediatamente
      if (status) {
        setStatus({
          ...status,
          fanState: value,
        })
      }
      
      // Refrescamos el estado después de un breve retraso para confirmar el cambio
      setTimeout(() => {
        fetchTerrarioStatus()
      }, 1000)
    } catch (error) {
      console.error("Error toggling fan:", error)
      setError("Error al controlar el ventilador")
      // Revert the UI state
      if (status) {
        setStatus({
          ...status,
          fanState: !value,
        })
      }
    }
  }

  const handleLampToggle = async (value: boolean) => {
    try {
      setError(null)
      await api.controlActuator({ actuador: "lamp", accion: value ? "on" : "off" })

      // Actualizamos el estado local para reflejar el cambio inmediatamente
      if (status) {
        setStatus({
          ...status,
          lampState: value,
        })
      }
      
      // Refrescamos el estado después de un breve retraso para confirmar el cambio
      setTimeout(() => {
        fetchTerrarioStatus()
      }, 1000)
    } catch (error) {
      console.error("Error toggling lamp:", error)
      setError("Error al controlar la lámpara")
      // Revert the UI state
      if (status) {
        setStatus({
          ...status,
          lampState: !value,
        })
      }
    }
  }

  const dispenseFood = async () => {
    try {
      setError(null)
      await api.controlActuator({ actuador: "dispense", accion: "on" })
      Alert.alert("Éxito", "Comida dispensada correctamente")
      
      // Refrescamos el estado después de dispensar comida
      setTimeout(() => {
        fetchTerrarioStatus()
      }, 1000)
    } catch (error) {
      console.error("Error dispensing food:", error)
      setError("Error al dispensar comida")
    }
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#55b96a" />
        <Text style={styles.loadingText}>Cargando datos del terrario...</Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#55b96a"]} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Control del Terrario</Text>
        <Text style={styles.subtitle}>Monitorea y controla el hábitat de tu tortuga</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {status && (
        <>
          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>Estado Actual</Text>

            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <Ionicons name="thermometer-outline" size={24} color="#55b96a" />
                <Text style={styles.statusLabel}>Temperatura</Text>
                <Text style={styles.statusValue}>{status.temperature}°C</Text>
              </View>

              <View style={styles.statusItem}>
                <Ionicons name="water-outline" size={24} color="#55b96a" />
                <Text style={styles.statusLabel}>Nivel de Comida</Text>
                <Text style={styles.statusValue}>{status.foodLevel}</Text>
              </View>
            </View>

            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <Ionicons
                  name={status.turtleActivity ? "footsteps-outline" : "bed-outline"}
                  size={24}
                  color="#55b96a"
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
              />
            </View>

            <TouchableOpacity style={styles.foodButton} onPress={dispenseFood}>
              <Ionicons name="fast-food-outline" size={24} color="#fff" />
              <Text style={styles.foodButtonText}>Dispensar Comida</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  )
}

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
    marginBottom: 25,
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
})

export default TerrarioControlScreen