"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import * as api from "../../api/api"
import type { Producto } from "../../types"

const { width } = Dimensions.get("window")

const ProductosScreen = () => {
  const navigation = useNavigation<any>()
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true)
        const response = await api.fetchProductos()
        setProductos(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching productos:", error)
        setError("Error al cargar los productos")
        setLoading(false)
      }
    }

    fetchProductos()
  }, [])

  const handleLoginPress = () => {
    navigation.navigate("Login")
  }

  const renderProductItem = ({ item }: { item: Producto }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.imagenes[0] }} style={styles.productImage} resizeMode="cover" />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.nombre}</Text>
        <Text style={styles.productPrice}>${item.precio.toFixed(2)}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.descripcion}
        </Text>
      </View>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#55b96a" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Productos</Text>
        <Text style={styles.subtitle}>Explora nuestra selección de productos</Text>
      </View>

      {productos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="basket-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No hay productos disponibles</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={productos}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.productsList}
          />

          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>Inicia sesión para ver más detalles y comprar</Text>
            <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
              <Text style={styles.loginButtonText}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5fff7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5fff7",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5fff7",
  },
  errorText: {
    fontSize: 16,
    color: "#ff5252",
    textAlign: "center",
    fontWeight: "500",
  },
  header: {
    padding: 20,
    backgroundColor: "#e0ffea",
    borderBottomWidth: 1,
    borderBottomColor: "#c3e6cd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e8b57",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#4b8063",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c3e6cd",
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: "#5a8a74",
    textAlign: "center",
    fontStyle: "italic",
  },
  productsList: {
    padding: 15,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#c3e6cd",
  },
  productImage: {
    width: "100%",
    height: 180,
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e7d52",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18a558",
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: "#4b8063",
    lineHeight: 20,
  },
  loginPrompt: {
    backgroundColor: "#e0ffea",
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: "#c3e6cd",
    alignItems: "center",
  },
  loginText: {
    fontSize: 15,
    color: "#2e7d52",
    marginBottom: 12,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#18a558",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
})

export default ProductosScreen

