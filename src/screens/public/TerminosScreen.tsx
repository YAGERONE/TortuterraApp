"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from "react-native"
import * as api from "../../api/api"
import type { Termino } from "../../types"

const TerminosScreen = () => {
  const [terminos, setTerminos] = useState<Termino[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTerminos = async () => {
      try {
        setLoading(true)
        const response = await api.fetchTerminos()
        setTerminos(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching términos:", error)
        setError("Error al cargar los términos y condiciones")
        setLoading(false)
      }
    }

    fetchTerminos()
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
        <Text style={styles.title}>Términos y Condiciones</Text>
        <Text style={styles.subtitle}>Información importante sobre el uso de nuestros servicios</Text>
      </View>

      {terminos.length > 0 ? (
        <View style={styles.contentContainer}>
          {terminos.map((termino) => (
            <View key={termino._id} style={styles.termsCard}>
              <Text style={styles.termsTitle}>{termino.titulo}</Text>
              <Text style={styles.termsDescription}>{termino.descripcion}</Text>
              <Text style={styles.termsDate}>Fecha: {new Date(termino.fechaCreacion).toLocaleDateString()}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No hay términos y condiciones disponibles</Text>
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
  termsCard: {
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
  termsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d52",
    marginBottom: 10,
  },
  termsDescription: {
    fontSize: 16,
    color: "#4b8063",
    lineHeight: 24,
    marginBottom: 15,
  },
  termsDate: {
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

export default TerminosScreen

