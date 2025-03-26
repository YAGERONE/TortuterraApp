//src/context/AuthContext.tsx

"use client"

import type React from "react"
import { createContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as api from "../api/api"
import type { User, AuthState } from "../types"

interface AuthContextProps {
  authState: AuthState
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
  resetPassword: (email: string, securityAnswer: string, newPassword: string) => Promise<void>
  verifyEmail: (email: string) => Promise<boolean>
  getSecurityQuestion: (email: string) => Promise<string>
}

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  token: null,
}

export const AuthContext = createContext<AuthContextProps>({
  authState: defaultAuthState,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  resetPassword: async () => {},
  verifyEmail: async () => false,
  getSecurityQuestion: async () => "",
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState)

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        const userData = await AsyncStorage.getItem("user")

        if (token && userData) {
          setAuthState({
            isAuthenticated: true,
            user: JSON.parse(userData),
            loading: false,
            error: null,
            token,
          })
        } else {
          setAuthState({
            ...defaultAuthState,
            loading: false,
          })
        }
      } catch (error) {
        console.error("Error loading auth state:", error)
        setAuthState({
          ...defaultAuthState,
          loading: false,
          error: "Error al cargar la sesión",
        })
      }
    }

    loadToken()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }))
      const response = await api.loginUser({ email, password })

      const { token, rol, nombre } = response.data

      // Create a basic user object with the limited data we have
      const user: Partial<User> = {
        email,
        rol,
        nombre,
      }

      await AsyncStorage.setItem("token", token)
      await AsyncStorage.setItem("user", JSON.stringify(user))

      setAuthState({
        isAuthenticated: true,
        user: user as User,
        loading: false,
        error: null,
        token,
      })
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message)
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.error || "Error al iniciar sesión",
      }))
    }
  }

  const register = async (userData: any) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }))
      await api.registerUser(userData)
      // After successful registration, we can login automatically
      await login(userData.email, userData.password)
    } catch (error: any) {
      console.error("Registration error:", error.response?.data || error.message)
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.error || "Error al registrar usuario",
      }))
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("user")
      setAuthState({
        ...defaultAuthState,
        loading: false,
      })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }))
      // Here you would typically make an API call to update the user profile
      // As this endpoint is not defined in your backend, we'll just update local state

      const updatedUser = { ...authState.user, ...userData } as User
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser))

      setAuthState((prev) => ({
        ...prev,
        user: updatedUser,
        loading: false,
      }))
    } catch (error: any) {
      console.error("Update profile error:", error)
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: "Error al actualizar perfil",
      }))
    }
  }

  const resetPassword = async (email: string, securityAnswer: string, newPassword: string) => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }))

      // First verify the security answer
      await api.verifySecurityAnswer(email, securityAnswer)

      // Then change the password
      await api.changePassword(email, newPassword)

      setAuthState((prev) => ({
        ...prev,
        loading: false,
      }))
    } catch (error: any) {
      console.error("Password reset error:", error.response?.data || error.message)
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.error || "Error al restablecer contraseña",
      }))
    }
  }

  const verifyEmail = async (email: string): Promise<boolean> => {
    try {
      await api.verifyEmail(email)
      return true
    } catch (error) {
      console.error("Email verification error:", error)
      return false
    }
  }

  const getSecurityQuestion = async (email: string): Promise<string> => {
    try {
      const response = await api.getSecurityQuestion(email)
      return response.data.preguntaSecreta
    } catch (error) {
      console.error("Get security question error:", error)
      return ""
    }
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        register,
        logout,
        updateProfile,
        resetPassword,
        verifyEmail,
        getSecurityQuestion,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

