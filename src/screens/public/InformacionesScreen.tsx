"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native"
import * as api from "../../api/api"
import type { Informacion } from "../../types"

const { width } = Dimensions.get("window")

const InformacionesScreen = () => {
  const [informaciones, setInformaciones] = useState<Informacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const fetchInformaciones = async () => {
      try {
        setLoading(true)
        const response = await api.fetchInformaciones()
        setInformaciones(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching informaciones:", error)
        setError("Error al cargar la información")
        setLoading(false)
      }
    }

    fetchInformaciones()
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
        <Text style={styles.title}>Información de Especies</Text>
        <Text style={styles.subtitle}>Conoce más sobre las tortugas</Text>
      </View>

      {informaciones.length > 0 ? (
        informaciones.map((info) => (
          <TouchableOpacity
            key={info._id}
            style={styles.infoCard}
            onPress={() => toggleExpand(info._id)}
            activeOpacity={0.8}
          >
            <View style={styles.infoHeader}>
              <Text style={styles.especieTitle}>{info.especie}</Text>
            </View>

            <Image source={{ uri: info.imagen }} style={styles.infoImage} resizeMode="cover" />

            <View style={styles.infoContent}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Alimentación:</Text>
                  <Text style={styles.infoValue}>{info.alimentacion}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Temperatura ideal:</Text>
                  <Text style={styles.infoValue}>{info.temperatura_ideal}</Text>
                </View>

                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Humedad ideal:</Text>
                  <Text style={styles.infoValue}>{info.humedad_ideal}</Text>
                </View>
              </View>

              {expandedId === info._id && (
                <View style={styles.descripcionContainer}>
                  <Text style={styles.descripcionLabel}>Descripción:</Text>
                  <Text style={styles.descripcionText}>{info.descripcion}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No hay información disponible</Text>
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
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#c3e6cd",
  },
  infoHeader: {
    padding: 15,
    backgroundColor: "#18a558",
  },
  especieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  infoImage: {
    width: "100%",
    height: 200,
  },
  infoContent: {
    padding: 18,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#5a8a74",
    marginBottom: 3,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: "#2e7d52",
    fontWeight: "500",
  },
  descripcionContainer: {
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0ffea",
  },
  descripcionLabel: {
    fontSize: 16,
    color: "#2e7d52",
    fontWeight: "600",
    marginBottom: 6,
  },
  descripcionText: {
    fontSize: 16,
    color: "#4b8063",
    lineHeight: 24,
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

export default InformacionesScreen

