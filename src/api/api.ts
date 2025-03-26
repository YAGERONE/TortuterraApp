// src/api/api.ts
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Base URL for your Vercel-hosted API
const API_URL = "https://terrario1.vercel.app/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token")
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Public information endpoints
export const fetchContactos = () => api.get("/contactos")
export const fetchInformaciones = () => api.get("/informaciones")
export const fetchMisiones = () => api.get("/misiones")
export const fetchPoliticas = () => api.get("/politicas")
export const fetchPreguntas = () => api.get("/preguntas")
export const fetchProductos = () => api.get("/productos")
export const fetchTerminos = () => api.get("/terminos")
export const fetchVisiones = () => api.get("/visiones")

// Auth endpoints
export const registerUser = (userData: any) => api.post("/usuarios/register", userData)
export const loginUser = (credentials: { email: string; password: string }) => api.post("/usuarios/login", credentials)
export const verifyEmail = (email: string) => api.post("/usuarios/verificar-correo", { email })
export const getSecurityQuestion = (email: string) => api.post("/usuarios/obtener-pregunta", { email })
export const verifySecurityAnswer = (email: string, respuesta: string) =>
  api.post("/usuarios/verificar-respuesta", { email, respuesta })
export const changePassword = (email: string, nuevaPassword: string) =>
  api.post("/usuarios/cambiar-contrasena", { email, nuevaPassword })

// Terrarium device control
export const controlActuator = (actuador: string, accion: string) => api.post("/control", { actuador, accion })
export const getTerrarioData = () => api.get("/terrario")

export default api 

