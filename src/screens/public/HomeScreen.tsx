"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import * as api from "../../api/api"
import type { Mision, Vision } from "../../types"

const HomeScreen = () => {
  const navigation = useNavigation<any>()
  const [loading, setLoading] = useState(true)
  const [mision, setMision] = useState<Mision | null>(null)
  const [vision, setVision] = useState<Vision | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [misionesRes, visionesRes] = await Promise.all([api.fetchMisiones(), api.fetchVisiones()])

        if (misionesRes.data.length > 0) {
          setMision(misionesRes.data[0])
        }

        if (visionesRes.data.length > 0) {
          setVision(visionesRes.data[0])
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching home data:", error)
        setError("Error al cargar la información")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const navigateToLogin = () => {
    navigation.navigate("Login")
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
        <TouchableOpacity onPress={() => setError(null)}>
          <Text style={styles.tryAgainText}>Intentar de nuevo</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1583849790559-06765e5923dc?q=80&w=1000&auto=format&fit=crop",
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <Text style={styles.heroTitle}>TortuTerra</Text>
          <Text style={styles.heroSubtitle}>El mejor hogar para tu tortuga</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Misión</Text>
          {mision ? (
            <>
              <Text style={styles.sectionSubtitle}>{mision.titulo}</Text>
              <Text style={styles.sectionText}>{mision.descripcion}</Text>
            </>
          ) : (
            <Text style={styles.placeholderText}>No hay información de misión disponible.</Text>
          )}
          <TouchableOpacity style={styles.moreButton} onPress={() => navigation.navigate("Misiones")}>
            <Text style={styles.moreButtonText}>Ver más</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visión</Text>
          {vision ? (
            <>
              <Text style={styles.sectionSubtitle}>{vision.titulo}</Text>
              <Text style={styles.sectionText}>{vision.descripcion}</Text>
            </>
          ) : (
            <Text style={styles.placeholderText}>No hay información de visión disponible.</Text>
          )}
          <TouchableOpacity style={styles.moreButton} onPress={() => navigation.navigate("Visiones")}>
            <Text style={styles.moreButtonText}>Ver más</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <TouchableOpacity style={styles.infoItem} onPress={() => navigation.navigate("Terminos")}>
            <Ionicons name="document-text-outline" size={24} color="#55b96a" />
            <Text style={styles.infoText}>Términos y Condiciones</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem} onPress={() => navigation.navigate("Politicas")}>
            <Ionicons name="shield-outline" size={24} color="#55b96a" />
            <Text style={styles.infoText}>Políticas de Privacidad</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem} onPress={() => navigation.navigate("Preguntas")}>
            <Ionicons name="help-circle-outline" size={24} color="#55b96a" />
            <Text style={styles.infoText}>Preguntas Frecuentes</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={navigateToLogin}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 12,
    fontWeight: "500",
  },
  tryAgainText: {
    fontSize: 16,
    color: "#18a558",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  heroContainer: {
    height: 250,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#c3e6cd",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e8b57",
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e7d52",
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 16,
    color: "#4b8063",
    lineHeight: 24,
  },
  placeholderText: {
    fontSize: 16,
    color: "#5a8a74",
    fontStyle: "italic",
  },
  moreButton: {
    marginTop: 12,
    alignSelf: "flex-end",
    backgroundColor: "#e0ffea",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  moreButtonText: {
    fontSize: 15,
    color: "#18a558",
    fontWeight: "600",
  },
  infoContainer: {
    marginVertical: 20,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#c3e6cd",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e0ffea",
  },
  infoText: {
    fontSize: 16,
    color: "#2e7d52",
    marginLeft: 10,
  },
  loginButton: {
    backgroundColor: "#18a558",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
})

export default HomeScreen

