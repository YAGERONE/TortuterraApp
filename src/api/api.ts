// src/api/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Base URL para tu API alojada en Vercel
const API_URL = "https://backend-red-nine-96.vercel.app/api"

// Interfaces para tipos de datos
export interface Usuario {
  id?: string
  nombre?: string
  email: string
  password?: string
  preguntaSeguridad?: string
  respuestaSeguridad?: string
}

export interface Credenciales {
  email: string
  password: string
}

export interface ControlActuador {
  actuador: string
  accion: string
}

export interface CambioPassword {
  email: string
  nuevaPassword: string
}

// Crear instancia de axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Timeout de 10 segundos
})

// Interceptor para agregar el token de autenticación a las solicitudes
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = await AsyncStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Si el error es 401 (Unauthorized) y no hemos intentado reenviar la solicitud
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Aquí podrías implementar la lógica para refrescar el token si lo necesitas
        // Por ejemplo: const refreshToken = await AsyncStorage.getItem("refreshToken")
        // const response = await api.post("/usuarios/refresh-token", { refreshToken })
        // await AsyncStorage.setItem("token", response.data.token)
        
        // Por ahora, simplemente limpiaremos el token y rechazaremos
        await AsyncStorage.removeItem("token")
        return Promise.reject(error)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

// Función genérica para peticiones GET
export const fetch = (url: string) => api.get(url);

// Endpoints de información pública
export const fetchContactos = () => api.get("/contactos")
export const fetchInformaciones = () => api.get("/informaciones")
export const fetchMisiones = () => api.get("/misiones")
export const fetchPoliticas = () => api.get("/politicas")
export const fetchPreguntas = () => api.get("/preguntas")
export const fetchProductos = () => api.get("/productos")
export const fetchTerminos = () => api.get("/terminos")
export const fetchVisiones = () => api.get("/visiones")

// Endpoints de autenticación y gestión de usuarios
export const registerUser = (userData: Usuario) => api.post("/usuarios/register", userData)
export const loginUser = (credentials: Credenciales) => api.post("/usuarios/login", credentials)
export const verifyEmail = (email: string) => api.post("/usuarios/verificar-correo", { email })
export const getSecurityQuestion = (email: string) => api.post("/usuarios/obtener-pregunta", { email })
export const verifySecurityAnswer = (email: string, respuesta: string) =>
  api.post("/usuarios/verificar-respuesta", { email, respuesta })
export const changePassword = (datos: CambioPassword) =>
  api.post("/usuarios/cambiar-contrasena", datos)
export const getUserProfile = () => api.get("/usuarios/perfil")
export const updateUserProfile = (userData: Partial<Usuario>) => api.put("/usuarios/perfil", userData)

// Control de dispositivos terrario
export const controlActuator = (datos: ControlActuador) => api.post("/control", datos)
export const getTerrarioData = () => api.get("/terrario")
export const getTerrarioHistory = (days: number = 7) => api.get(`/terrario/historial?dias=${days}`)
export const getTerrarioStatus = () => api.get("/terrario/estado")
export const getTerrarioConnectivity = () => api.get("/terrario/conectividad")

// Exportar API por defecto
export default api