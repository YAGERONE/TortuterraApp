"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, Linking, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as api from "../../api/api"
import type { Contacto } from "../../types"

const ContactosScreen = () => {
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContactos = async () => {
      try {
        setLoading(true)
        const response = await api.fetchContactos()
        setContactos(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching contactos:", error)
        setError("Error al cargar la información de contacto")
        setLoading(false)
      }
    }

    fetchContactos()
  }, [])

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`)
  }

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`)
  }

  const handleLocation = (location: string) => {
    Linking.openURL(`https://maps.google.com/?q=${location}`)
  }

  const handleSocialMedia = (url: string) => {
    Linking.openURL(url)
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
        <Text style={styles.title}>Contacto</Text>
        <Text style={styles.subtitle}>Estamos aquí para ayudarte</Text>
      </View>

      {contactos.length > 0 ? (
        contactos.map((contacto) => (
          <View key={contacto._id} style={styles.contactCard}>
            <TouchableOpacity style={styles.contactItem} onPress={() => handleEmail(contacto.email)}>
              <Ionicons name="mail" size={24} color="#55b96a" />
              <Text style={styles.contactText}>{contacto.email}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactItem} onPress={() => handleCall(contacto.telefono)}>
              <Ionicons name="call" size={24} color="#55b96a" />
              <Text style={styles.contactText}>{contacto.telefono}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactItem} onPress={() => handleLocation(contacto.ubicacion)}>
              <Ionicons name="location" size={24} color="#55b96a" />
              <Text style={styles.contactText}>{contacto.ubicacion}</Text>
            </TouchableOpacity>

            {contacto.redes_sociales && contacto.redes_sociales.length > 0 && (
              <View style={styles.socialContainer}>
                <Text style={styles.socialTitle}>Redes Sociales</Text>
                {contacto.redes_sociales.map((red, index) => (
                  <TouchableOpacity key={index} style={styles.socialItem} onPress={() => handleSocialMedia(red.enlace)}>
                    <Ionicons
                      name={
                        red.nombre.toLowerCase().includes("facebook")
                          ? "logo-facebook"
                          : red.nombre.toLowerCase().includes("instagram")
                            ? "logo-instagram"
                            : red.nombre.toLowerCase().includes("twitter")
                              ? "logo-twitter"
                              : "globe"
                      }
                      size={22}
                      color="#55b96a"
                    />
                    <Text style={styles.socialText}>{red.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))
      ) : (
        <View style={styles.noDataContainer}>
          <Ionicons name="information-circle-outline" size={48} color="#ccc" />
          <Text style={styles.noDataText}>No hay información de contacto disponible</Text>
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
  contactCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 15,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#c3e6cd",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e0ffea",
  },
  contactText: {
    fontSize: 16,
    color: "#2e7d52",
    marginLeft: 15,
  },
  socialContainer: {
    marginTop: 10,
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e7d52",
    marginBottom: 10,
    marginTop: 8,
  },
  socialItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginLeft: 5,
  },
  socialText: {
    fontSize: 16,
    color: "#2e7d52",
    marginLeft: 15,
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
    marginTop: 15,
  },
})

export default ContactosScreen

