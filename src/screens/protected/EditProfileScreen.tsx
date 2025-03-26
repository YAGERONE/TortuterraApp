"use client"

import { useState, useContext } from "react"
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../../context/AuthContext"
import type { User } from "../../types"

const EditProfileScreen = () => {
  const navigation = useNavigation<any>()
  const { authState, updateProfile } = useContext(AuthContext)
  const { user, loading } = authState

  // Initialize form state with current user data
  const [formData, setFormData] = useState<Partial<User>>({
    nombre: user?.nombre || "",
    ap: user?.ap || "",
    am: user?.am || "",
    username: user?.username || "",
    email: user?.email || "",
    telefono: user?.telefono || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate nombre
    if (!formData.nombre?.trim()) {
      newErrors.nombre = "El nombre es obligatorio"
    }

    // Validate apellido paterno
    if (!formData.ap?.trim()) {
      newErrors.ap = "El apellido paterno es obligatorio"
    }

    // Validate apellido materno
    if (!formData.am?.trim()) {
      newErrors.am = "El apellido materno es obligatorio"
    }

    // Validate username
    if (!formData.username?.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio"
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email?.trim()) {
      newErrors.email = "El correo electrónico es obligatorio"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido"
    }

    // Validate phone
    const phoneRegex = /^[0-9]{10}$/
    if (!formData.telefono?.trim()) {
      newErrors.telefono = "El teléfono es obligatorio"
    } else if (!phoneRegex.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener 10 dígitos"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpdateProfile = async () => {
    if (validateForm()) {
      try {
        await updateProfile(formData)
        Alert.alert("Éxito", "Perfil actualizado correctamente")
        navigation.goBack()
      } catch (error) {
        Alert.alert("Error", "Ocurrió un error al actualizar el perfil")
      }
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Editar Perfil</Text>
        <Text style={styles.subtitle}>Actualiza tu información personal</Text>
      </View>

      <View style={styles.form}>
        {/* Nombre */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={[styles.input, errors.nombre ? styles.inputError : null]}
            placeholder="Ingresa tu nombre"
            value={formData.nombre}
            onChangeText={(value) => updateField("nombre", value)}
          />
          {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
        </View>

        {/* Apellido Paterno */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellido Paterno</Text>
          <TextInput
            style={[styles.input, errors.ap ? styles.inputError : null]}
            placeholder="Ingresa tu apellido paterno"
            value={formData.ap}
            onChangeText={(value) => updateField("ap", value)}
          />
          {errors.ap && <Text style={styles.errorText}>{errors.ap}</Text>}
        </View>

        {/* Apellido Materno */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellido Materno</Text>
          <TextInput
            style={[styles.input, errors.am ? styles.inputError : null]}
            placeholder="Ingresa tu apellido materno"
            value={formData.am}
            onChangeText={(value) => updateField("am", value)}
          />
          {errors.am && <Text style={styles.errorText}>{errors.am}</Text>}
        </View>

        {/* Username */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre de Usuario</Text>
          <TextInput
            style={[styles.input, errors.username ? styles.inputError : null]}
            placeholder="Ingresa un nombre de usuario"
            value={formData.username}
            onChangeText={(value) => updateField("username", value)}
            autoCapitalize="none"
          />
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            placeholder="Ingresa tu correo electrónico"
            value={formData.email}
            onChangeText={(value) => updateField("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Teléfono */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={[styles.input, errors.telefono ? styles.inputError : null]}
            placeholder="Ingresa tu número de teléfono (10 dígitos)"
            value={formData.telefono}
            onChangeText={(value) => updateField("telefono", value)}
            keyboardType="phone-pad"
            maxLength={10}
          />
          {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleUpdateProfile} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Guardar Cambios</Text>}
          </TouchableOpacity>
        </View>
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
    padding: 22,
    marginBottom: 15,
    backgroundColor: "#e0ffea",
    borderBottomWidth: 1,
    borderBottomColor: "#c3e6cd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e8b57",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#4b8063",
  },
  form: {
    padding: 20,
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e7d52",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f9fffc",
    borderWidth: 1.5,
    borderColor: "#c3e6cd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#ff5252",
    borderWidth: 1.5,
  },
  errorText: {
    color: "#ff5252",
    fontSize: 14,
    marginTop: 5,
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#c3e6cd",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#2e7d52",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#18a558",
    marginLeft: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
})

export default EditProfileScreen

