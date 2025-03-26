"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from "react-native"
import * as api from "../../api/api"
import type { Politica } from "../../types"

const PoliticasScreen = () => {
  const [politicas, setPoliticas] = useState<Politica[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPoliticas = async () => {
      try {
        setLoading(true)
        const response = await api.fetchPoliticas()
        setPoliticas(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching políticas:", error)
        setError("Error al cargar las políticas de privacidad")
        setLoading(false)
      }
    }

    fetchPoliticas()
  }, [])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#55b96a" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Políticas de Privacidad</Text>
        <Text style={styles.subtitle}>Información sobre cómo protegemos tus datos</Text>
      </View>

      {politicas.length > 0 ? (
        <View style={styles.contentContainer}>
          {politicas.map((politica) => (
            <View key={politica._id} style={styles.policyCard}>
              <Text style={styles.policyTitle}>{politica.titulo}</Text>
              <Text style={styles.policyContent}>{politica.contenido}</Text>
              <Text style={styles.policyDate}>
                Última actualización: {new Date(politica.ultimaActualizacion).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No hay políticas de privacidad disponibles</Text>
        </View>
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
    backgroundColor: "#f5fff7",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5fff7",
  },
  errorText: {
    fontSize: 16,
    color: "#ff5252",
    textAlign: "center",
    fontWeight: "500",
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
  contentContainer: {
    padding: 15,
  },
  policyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#c3e6cd",
  },
  policyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d52",
    marginBottom: 10,
  },
  policyContent: {
    fontSize: 16,
    color: "#4b8063",
    lineHeight: 24,
    marginBottom: 15,
  },
  policyDate: {
    fontSize: 14,
    color: "#5a8a74",
    fontStyle: "italic",
  },
  noDataContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c3e6cd",
  },
  noDataText: {
    fontSize: 16,
    color: "#5a8a74",
    textAlign: "center",
    fontStyle: "italic",
  },
})

export default PoliticasScreen

