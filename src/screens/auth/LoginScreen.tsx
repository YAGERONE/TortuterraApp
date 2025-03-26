"use client"

import { useState, useContext } from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from "../../context/AuthContext"

const LoginScreen = () => {
  const navigation = useNavigation<any>()
  const { login, authState } = useContext(AuthContext)
  const { loading, error } = authState

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError("El correo electrónico es obligatorio")
      return false
    } else if (!emailRegex.test(email)) {
      setEmailError("Correo electrónico inválido")
      return false
    }
    setEmailError("")
    return true
  }

  const validatePassword = () => {
    if (!password) {
      setPasswordError("La contraseña es obligatoria")
      return false
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres")
      return false
    }
    setPasswordError("")
    return true
  }

  const handleLogin = async () => {
    const isEmailValid = validateEmail()
    const isPasswordValid = validatePassword()

    if (isEmailValid && isPasswordValid) {
      try {
        await login(email, password)
      } catch (error) {
        Alert.alert("Error", "Ocurrió un error al iniciar sesión")
      }
    }
  }

  const navigateToRegister = () => {
    navigation.navigate("Register")
  }

  const navigateToForgotPassword = () => {
    navigation.navigate("ForgotPassword")
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>Accede a tu cuenta de TortuTerra</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="Ingresa tu correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onBlur={validateEmail}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={[styles.passwordContainer, passwordError ? styles.inputError : null]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Ingresa tu contraseña"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onBlur={validatePassword}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#2e7d52" />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          <TouchableOpacity style={styles.forgotPassword} onPress={navigateToForgotPassword}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {error && <Text style={styles.apiErrorText}>{error}</Text>}

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Iniciar Sesión</Text>}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.registerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5fff7",
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 25,
  },
  header: {
    marginBottom: 35,
    backgroundColor: "#e0ffea",
    padding: 22,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
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
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 22,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: "#18a558",
    fontSize: 15,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#18a558",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
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
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  registerText: {
    fontSize: 16,
    color: "#5a8a74",
  },
  registerLink: {
    fontSize: 16,
    color: "#18a558",
    fontWeight: "600",
  },
})

export default LoginScreen