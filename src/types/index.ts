//src/types/index.ts
// User types
export interface User {
  _id: string
  nombre: string
  ap: string
  am: string
  username: string
  email: string
  telefono: string
  rol: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  error: string | null
  token: string | null
}

// Content types
export interface Contacto {
  _id: string
  email: string
  telefono: string
  ubicacion: string
  redes_sociales: Array<{ nombre: string; enlace: string }>
}

export interface Informacion {
  _id: string
  especie: string
  alimentacion: string
  temperatura_ideal: string
  humedad_ideal: string
  descripcion: string
  imagen: string
}

export interface Mision {
  _id: string
  titulo: string
  descripcion: string
  fechaCreacion: string
}

export interface Politica {
  _id: string
  titulo: string
  contenido: string
  ultimaActualizacion: string
}

export interface Pregunta {
  _id: string
  pregunta: string
  respuesta: string
  fechaCreacion: string
}

export interface Producto {
  _id: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  imagenes: string[]
  ultima_actualizacion: string
}

export interface Termino {
  _id: string
  titulo: string
  descripcion: string
  fechaCreacion: string
}

export interface Vision {
  _id: string
  titulo: string
  descripcion: string
  fechaCreacion: string
}

// Terrarium device types
export interface TerrarioData {
  dispositivo_id: string
  temperatura: number
  humedad: number
  luz: number
  ventilador: number
  pir: number
  fecha_registro: string
}

export interface TerrarioStatus {
  temperature: number
  fanState: boolean
  foodLevel: string
  turtleActivity: boolean
  stableTemp: number
  maxTemp: number
  lampState: boolean
}

