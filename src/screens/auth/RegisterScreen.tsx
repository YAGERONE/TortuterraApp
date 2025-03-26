"use client"

import { useState, useContext } from "react"
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../../context/AuthContext"

const preguntasSecretas = [
  { id: "personaje-favorito", question: "¿Cuál es tu personaje favorito?" },
  { id: "pelicula-favorita", question: "¿Cuál es tu película favorita?" },
  { id: "mejor-amigo", question: "¿Quién es tu mejor amigo?" },
  { id: "nombre-mascota", question: "¿Cuál es el nombre de tu mascota?" },
  { id: "deporte-favorito", question: "¿Cuál es tu deporte favorito?" },
]

const RegisterScreen = () => {
  const navigation = useNavigation<any>()
  const { register, authState } = useContext(AuthContext)
  const { loading, error } = authState

  const [formData, setFormData] = useState({
    nombre: "",
    ap: "",
    am: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    preguntaSecreta: preguntasSecretas[0].id,
    respuestaSecreta: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [showPicker, setShowPicker] = useState(false)

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear the error for this field
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Validate nombre
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio"
    }

    // Validate apellido paterno
    if (!formData.ap.trim()) {
      errors.ap = "El apellido paterno es obligatorio"
    }

    // Validate apellido materno
    if (!formData.am.trim()) {
      errors.am = "El apellido materno es obligatorio"
    }

    // Validate username
    if (!formData.username.trim()) {
      errors.username = "El nombre de usuario es obligatorio"
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      errors.email = "El correo electrónico es obligatorio"
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Ingresa un correo electrónico válido"
    }

    // Validate password
    if (!formData.password) {
      errors.password = "La contraseña es obligatoria"
    } else if (formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden"
    }

    // Validate phone
    const phoneRegex = /^[0-9]{10}$/
    if (!formData.telefono.trim()) {
      errors.telefono = "El teléfono es obligatorio"
    } else if (!phoneRegex.test(formData.telefono)) {
      errors.telefono = "El teléfono debe tener 10 dígitos"
    }

    // Validate security answer
    if (!formData.respuestaSecreta.trim()) {
      errors.respuestaSecreta = "La respuesta secreta es obligatoria"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        const { confirmPassword, ...registerData } = formData
        await register(registerData)
      } catch (error) {
        Alert.alert("Error", "Ocurrió un error al registrar el usuario")
      }
    } else {
      Alert.alert("Error", "Por favor corrige los errores en el formulario")
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Registro</Text>
        <Text style={styles.subtitle}>Crea tu cuenta en TortuTerra</Text>
      </View>

      <View style={styles.form}>
        {/* Nombre */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={[styles.input, formErrors.nombre ? styles.inputError : null]}
            placeholder="Ingresa tu nombre"
            value={formData.nombre}
            onChangeText={(value) => updateField("nombre", value)}
          />
          {formErrors.nombre && <Text style={styles.errorText}>{formErrors.nombre}</Text>}
        </View>

        {/* Apellido Paterno */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellido Paterno</Text>
          <TextInput
            style={[styles.input, formErrors.ap ? styles.inputError : null]}
            placeholder="Ingresa tu apellido paterno"
            value={formData.ap}
            onChangeText={(value) => updateField("ap", value)}
          />
          {formErrors.ap && <Text style={styles.errorText}>{formErrors.ap}</Text>}
        </View>

        {/* Apellido Materno */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellido Materno</Text>
          <TextInput
            style={[styles.input, formErrors.am ? styles.inputError : null]}
            placeholder="Ingresa tu apellido materno"
            value={formData.am}
            onChangeText={(value) => updateField("am", value)}
          />
          {formErrors.am && <Text style={styles.errorText}>{formErrors.am}</Text>}
        </View>

        {/* Username */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre de Usuario</Text>
          <TextInput
            style={[styles.input, formErrors.username ? styles.inputError : null]}
            placeholder="Ingresa un nombre de usuario"
            value={formData.username}
            onChangeText={(value) => updateField("username", value)}
            autoCapitalize="none"
          />
          {formErrors.username && <Text style={styles.errorText}>{formErrors.username}</Text>}
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={[styles.input, formErrors.email ? styles.inputError : null]}
            placeholder="Ingresa tu correo electrónico"
            value={formData.email}
            onChangeText={(value) => updateField("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={[styles.passwordContainer, formErrors.password ? styles.inputError : null]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChangeText={(value) => updateField("password", value)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#666" />
            </TouchableOpacity>
          </View>
          {formErrors.password && <Text style={styles.errorText}>{formErrors.password}</Text>}
        </View>

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <View style={[styles.passwordContainer, formErrors.confirmPassword ? styles.inputError : null]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirma tu contraseña"
              value={formData.confirmPassword}
              onChangeText={(value) => updateField("confirmPassword", value)}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="#666" />
            </TouchableOpacity>
          </View>
          {formErrors.confirmPassword && <Text style={styles.errorText}>{formErrors.confirmPassword}</Text>}
        </View>

        {/* Teléfono */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={[styles.input, formErrors.telefono ? styles.inputError : null]}
            placeholder="Ingresa tu número de teléfono (10 dígitos)"
            value={formData.telefono}
            onChangeText={(value) => updateField("telefono", value)}
            keyboardType="phone-pad"
            maxLength={10}
          />
          {formErrors.telefono && <Text style={styles.errorText}>{formErrors.telefono}</Text>}
        </View>

        {/* Pregunta Secreta */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Pregunta Secreta</Text>
          <TouchableOpacity style={styles.pickerButton} onPress={() => setShowPicker(true)}>
            <Text>{preguntasSecretas.find((p) => p.id === formData.preguntaSecreta)?.question}</Text>
            <Ionicons name="chevron-down" size={24} color="#666" />
          </TouchableOpacity>

          {showPicker && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.preguntaSecreta}
                onValueChange={(itemValue) => {
                  updateField("preguntaSecreta", itemValue)
                  setShowPicker(false)
                }}
              >
                {preguntasSecretas.map((item) => (
                  <Picker.Item key={item.id} label={item.question} value={item.id} />
                ))}
              </Picker>
              <TouchableOpacity style={styles.closePicker} onPress={() => setShowPicker(false)}>
                <Text style={styles.closePickerText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Respuesta Secreta */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Respuesta Secreta</Text>
          <TextInput
            style={[styles.input, formErrors.respuestaSecreta ? styles.inputError : null]}
            placeholder="Ingresa tu respuesta secreta"
            value={formData.respuestaSecreta}
            onChangeText={(value) => updateField("respuestaSecreta", value)}
          />
          {formErrors.respuestaSecreta && <Text style={styles.errorText}>{formErrors.respuestaSecreta}</Text>}
        </View>

        {error && <Text style={styles.apiErrorText}>{error}</Text>}

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerButtonText}>Registrarse</Text>}
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Iniciar Sesión</Text>
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
    fontSize: 28,
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
  passwordContainer: {
    flexDirection: "row",
    backgroundColor: "#f9fffc",
    borderWidth: 1.5,
    borderColor: "#c3e6cd",
    borderRadius: 10,
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fffc",
    borderWidth: 1.5,
    borderColor: "#c3e6cd",
    borderRadius: 10,
    padding: 14,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#c3e6cd",
    borderRadius: 10,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  closePicker: {
    alignItems: "center",
    padding: 12,
    backgroundColor: "#e0ffea",
    borderTopWidth: 1,
    borderTopColor: "#c3e6cd",
  },
  closePickerText: {
    color: "#18a558",
    fontWeight: "600",
    fontSize: 16,
  },
  errorText: {
    color: "#ff5252",
    fontSize: 14,
    marginTop: 5,
    fontWeight: "500",
  },
  apiErrorText: {
    color: "#ff5252",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "500",
  },
  registerButton: {
    backgroundColor: "#18a558",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  loginText: {
    fontSize: 16,
    color: "#5a8a74",
  },
  loginLink: {
    fontSize: 16,
    color: "#18a558",
    fontWeight: "600",
  },
})
export default RegisterScreen

