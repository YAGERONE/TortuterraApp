"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as api from "../../api/api"
import type { Pregunta } from "../../types"

const PreguntasScreen = () => {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        setLoading(true)
        const response = await api.fetchPreguntas()
        setPreguntas(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching preguntas:", error)
        setError("Error al cargar las preguntas frecuentes")
        setLoading(false)
      }
    }

    fetchPreguntas()
  }, [])

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

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
        <Text style={styles.title}>Preguntas Frecuentes</Text>
        <Text style={styles.subtitle}>Respuestas a tus dudas comunes</Text>
      </View>

      {preguntas.length > 0 ? (
        <View style={styles.faqContainer}>
          {preguntas.map((pregunta) => (
            <TouchableOpacity
              key={pregunta._id}
              style={styles.faqItem}
              onPress={() => toggleExpand(pregunta._id)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{pregunta.pregunta}</Text>
                <Ionicons
                  name={expandedId === pregunta._id ? "chevron-up" : "chevron-down"}
                  size={22}
                  color="#55b96a"
                />
              </View>

              {expandedId === pregunta._id && (
                <View style={styles.faqContent}>
                  <Text style={styles.faqAnswer}>{pregunta.respuesta}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No hay preguntas frecuentes disponibles</Text>
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
  faqContainer: {
    padding: 15,
  },
  faqItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#c3e6cd",
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e7d52",
    flex: 1,
    paddingRight: 10,
  },
  faqContent: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: "#f9fffc",
    borderTopWidth: 1,
    borderTopColor: "#e0ffea",
  },
  faqAnswer: {
    fontSize: 15,
    color: "#4b8063",
    lineHeight: 22,
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
export default PreguntasScreen

