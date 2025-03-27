//src/navigation/RootNavigator.tsx
"use client"

import { useContext } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from "../context/AuthContext"

// Public Screens
import HomeScreen from "../screens/public/HomeScreen"
import ContactosScreen from "../screens/public/ContactosScreen"
import InformacionesScreen from "../screens/public/InformacionesScreen"
import MisionesScreen from "../screens/public/MisionesScreen"
import PoliticasScreen from "../screens/public/PoliticasScreen"
import PreguntasScreen from "../screens/public/PreguntasScreen"
import ProductosScreen from "../screens/public/ProductosScreen"
import TerminosScreen from "../screens/public/TerminosScreen"
import VisionesScreen from "../screens/public/VisionesScreen"

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen"
import RegisterScreen from "../screens/auth/RegisterScreen"
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen"

// Protected Screens
import ProfileScreen from "../screens/protected/ProfileScreen"
import CatalogoScreen from "../screens/protected/CatalogoScreen"
import TerrarioControlScreen from "../screens/protected/TerrarioControlScreen"
import EditProfileScreen from "../screens/protected/EditProfileScreen"

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Public navigation tabs
const PublicTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = ""

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Contactos") {
            iconName = focused ? "call" : "call-outline"
          } else if (route.name === "Informaciones") {
            iconName = focused ? "information-circle" : "information-circle-outline"
          } else if (route.name === "Productos") {
            iconName = focused ? "cart" : "cart-outline"
          }

          return <Ionicons name={iconName as any} size={size} color={color} />
        },
        tabBarActiveTintColor: "#55b96a",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
      <Tab.Screen name="Productos" component={ProductosScreen} options={{ title: "Productos" }} />
      <Tab.Screen name="Informaciones" component={InformacionesScreen} options={{ title: "Información" }} />
      <Tab.Screen name="Contactos" component={ContactosScreen} options={{ title: "Contacto" }} />
    </Tab.Navigator>
  )
}

// Protected navigation tabs for logged in users
const ProtectedTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = ""

          if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          } else if (route.name === "Catalogo") {
            iconName = focused ? "grid" : "grid-outline"
          } else if (route.name === "TerrarioControl") {
            iconName = focused ? "thermometer" : "thermometer-outline"
          }

          return <Ionicons name={iconName as any} size={size} color={color} />
        },
        tabBarActiveTintColor: "#55b96a",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Mi Perfil" }} />
      <Tab.Screen name="Catalogo" component={CatalogoScreen} options={{ title: "Productos" }} />
      <Tab.Screen name="TerrarioControl" component={TerrarioControlScreen} options={{ title: "Mi Terrario" }} />
    </Tab.Navigator>
  )
}

const RootNavigator = () => {
  const { authState } = useContext(AuthContext)
  const { isAuthenticated, loading } = authState

  if (loading) {
    // You could return a loading screen here
    return null
  }

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        // Protected routes
        <>
          <Stack.Screen name="ProtectedTabs" component={ProtectedTabs} options={{ headerShown: false }} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: "Editar Perfil" }} />
        </>
      ) : (
        // Public routes
        <>
          <Stack.Screen name="PublicTabs" component={PublicTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Iniciar Sesión" }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Registrarse" }} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ title: "Recuperar Contraseña" }}
          />
          <Stack.Screen name="Misiones" component={MisionesScreen} />
          <Stack.Screen name="Politicas" component={PoliticasScreen} />
          <Stack.Screen name="Preguntas" component={PreguntasScreen} />
          <Stack.Screen name="Terminos" component={TerminosScreen} />
          <Stack.Screen name="Visiones" component={VisionesScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}

export default RootNavigator

