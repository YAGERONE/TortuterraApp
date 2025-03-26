"use client"

import { useState, useContext } from "react"
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { AuthContext } from "../../context/AuthContext"

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<any>()
  const { verifyEmail, getSecurityQuestion, resetPassword, authState } = useContext(AuthContext)
  const { loading } = authState

  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [securityQuestion, setSecurityQuestion] = useState("")
  const [securityAnswer, setSecurityAnswer] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")

  const validateEmail = async () => {
    if (!email) {
      setError("El correo electrónico es obligatorio")
      return
    }

    try {
      setError("")
      const emailExists = await verifyEmail(email)

      if (emailExists) {
        const question = await getSecurityQuestion(email)
        setSecurityQuestion(question)
        setStep(2)
      } else {
        setError("El correo electrónico no está registrado")
      }
    } catch (error) {
      setError("Error al verificar el correo electrónico")
    }
  }

  const validateAnswer = async () => {
    if (!securityAnswer) {
      setError("La respuesta es obligatoria")
      return
    }

    setError("")
    setStep(3)
  }

  const resetUserPassword = async () => {
    if (!newPassword) {
      setError("La nueva contraseña es obligatoria")
      return
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    try {
      setError("")
      await resetPassword(email, securityAnswer, newPassword)
      Alert.alert("Éxito", "Tu contraseña ha sido actualizada correctamente", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ])
    } catch (error) {
      setError("Error al cambiar la contraseña")
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text style={styles.subtitle}>Sigue los pasos para recuperar tu contraseña</Text>
      </View>

      <View style={styles.stepContainer}>
        <View style={styles.stepRow}>
          <View style={[styles.stepCircle, step >= 1 ? styles.activeStep : {}]}>
            <Text style={[styles.stepText, step >= 1 ? styles.activeStepText : {}]}>1</Text>
          </View>
          <View style={[styles.stepLine, step >= 2 ? styles.activeStep : {}]} />
          <View style={[styles.stepCircle, step >= 2 ? styles.activeStep : {}]}>
            <Text style={[styles.stepText, step >= 2 ? styles.activeStepText : {}]}>2</Text>
          </View>
          <View style={[styles.stepLine, step >= 3 ? styles.activeStep : {}]} />
          <View style={[styles.stepCircle, step >= 3 ? styles.activeStep : {}]}>
            <Text style={[styles.stepText, step >= 3 ? styles.activeStepText : {}]}>3</Text>
          </View>
        </View>
        <View style={styles.stepLabelRow}>
          <Text style={styles.stepLabel}>Email</Text>
          <Text style={styles.stepLabel}>Pregunta</Text>
          <Text style={styles.stepLabel}>Contraseña</Text>
        </View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {step === 1 && (
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={validateEmail} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Continuar</Text>}
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Pregunta de Seguridad</Text>
            <Text style={styles.questionText}>{securityQuestion}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Respuesta</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu respuesta"
              value={securityAnswer}
              onChangeText={setSecurityAnswer}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => setStep(1)}>
              <Text style={styles.backButtonText}>Atrás</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.continueButton]}
              onPress={validateAnswer}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Continuar</Text>}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 3 && (
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nueva Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Ingresa tu nueva contraseña"
                secureTextEntry={!showPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirma tu nueva contraseña"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => setStep(2)}>
              <Text style={styles.backButtonText}>Atrás</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.continueButton]}
              onPress={resetUserPassword}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Restablecer</Text>}
            </TouchableOpacity>
          </View>
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
  header: {
    padding: 20,
    backgroundColor: "#e0ffea",
    borderBottomWidth: 1,
    borderBottomColor: "#c3e6cd",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2e8b57",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#4b8063",
  },
  stepContainer: {
    paddingHorizontal: 20,
    marginVertical: 25,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#e0f5e9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#a0d8b3",
  },
  activeStep: {
    backgroundColor: "#1db954",
    borderColor: "#0b8a3a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  stepText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#95ab9c",
  },
  activeStepText: {
    color: "#fff",
  },
  stepLine: {
    flex: 1,
    height: 3,
    backgroundColor: "#e0f5e9",
    borderRadius: 1.5,
  },
  stepLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#5a8a74",
    textAlign: "center",
    width: "33%",
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
  questionText: {
    fontSize: 16,
    color: "#444",
    backgroundColor: "#f9fffc",
    borderWidth: 1.5,
    borderColor: "#c3e6cd",
    borderRadius: 10,
    padding: 14,
  },
  errorText: {
    color: "#ff5252",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 12,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#18a558",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  backButton: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#c3e6cd",
    flex: 1,
    marginRight: 10,
  },
  backButtonText: {
    color: "#18a558",
    fontSize: 17,
    fontWeight: "600",
  },
  continueButton: {
    flex: 1,
    marginLeft: 10,
  },
})

export default ForgotPasswordScreen