"use client"

import { useContext } from "react"
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from "../../context/AuthContext"

const ProfileScreen = () => {
  const navigation = useNavigation<any>()
  const { authState, logout } = useContext(AuthContext)
  const { user } = authState

  const handleEditProfile = () => {
    navigation.navigate("EditProfile")
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>{user?.nombre ? user.nombre[0].toUpperCase() : "U"}</Text>
          </View>
        </View>

        <Text style={styles.name}>
          {user?.nombre || ""} {user?.ap || ""} {user?.am || ""}
        </Text>
        <Text style={styles.username}>@{user?.username || ""}</Text>

        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Ionicons name="pencil" size={16} color="#fff" />
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Información Personal</Text>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <Ionicons name="mail-outline" size={20} color="#55b96a" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Correo Electrónico</Text>
            <Text style={styles.infoValue}>{user?.email || "No disponible"}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <Ionicons name="call-outline" size={20} color="#55b96a" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Teléfono</Text>
            <Text style={styles.infoValue}>{user?.telefono || "No disponible"}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#55b96a" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Rol</Text>
            <Text style={styles.infoValue}>{user?.rol === "admin" ? "Administrador" : "Usuario"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Catalogo")}>
          <Ionicons name="grid-outline" size={20} color="#55b96a" />
          <Text style={styles.actionButtonText}>Ver Catálogo</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("TerrarioControl")}>
          <Ionicons name="thermometer-outline" size={20} color="#55b96a" />
          <Text style={styles.actionButtonText}>Control del Terrario</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ff6b6b" />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
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
  header: {
    backgroundColor: "#e0ffea",
    padding: 25,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#c3e6cd",
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#18a558",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e7d52",
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: "#4b8063",
    marginBottom: 15,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18a558",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  editButtonText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 15,
  },
  infoSection: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 18,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#c3e6cd",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e7d52",
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  infoIcon: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0ffea",
    borderRadius: 21,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#c3e6cd",
  },
  infoContent: {
    flex: 1,
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#5a8a74",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#2e7d52",
    fontWeight: "500",
  },
  actionSection: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 18,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#c3e6cd",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0ffea",
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#2e7d52",
    marginLeft: 15,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    color: "#ff5252",
    fontWeight: "500",
    marginLeft: 15,
  },
})

export default ProfileScreen

