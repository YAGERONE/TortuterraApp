"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as api from "../../api/api"
import type { Producto } from "../../types"

const { width } = Dimensions.get("window")

const CatalogoScreen = () => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)

  const fetchProductos = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.fetchProductos()
      setProductos(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching productos:", error)
      setError("Error al cargar los productos")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductos()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchProductos()
    setRefreshing(false)
  }

  const openProductDetails = (product: Producto) => {
    setSelectedProduct(product)
  }

  const closeProductDetails = () => {
    setSelectedProduct(null)
  }

  const renderProductItem = ({ item }: { item: Producto }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => openProductDetails(item)} activeOpacity={0.8}>
      <Image source={{ uri: item.imagenes[0] }} style={styles.productImage} resizeMode="cover" />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.nombre}</Text>
        <Text style={styles.productPrice}>${item.precio.toFixed(2)}</Text>

        <View style={styles.stockContainer}>
          <Text style={[styles.stockText, item.stock > 0 ? styles.inStock : styles.outOfStock]}>
            {item.stock > 0 ? "En existencia" : "Agotado"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#55b96a" />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Catálogo de Productos</Text>
        <Text style={styles.subtitle}>Encuentra todo para tu tortuga</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {productos.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="basket-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No hay productos disponibles</Text>
        </View>
      ) : (
        <FlatList
          data={productos}
          renderItem={renderProductItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#55b96a"]} />}
        />
      )}

      {selectedProduct && (
        <View style={styles.overlay}>
          <View style={styles.productDetailCard}>
            <TouchableOpacity style={styles.closeButton} onPress={closeProductDetails}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>

            <View style={styles.imageSliderContainer}>
              <Image source={{ uri: selectedProduct.imagenes[0] }} style={styles.detailImage} resizeMode="cover" />
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>{selectedProduct.nombre}</Text>
              <Text style={styles.detailPrice}>${selectedProduct.precio.toFixed(2)}</Text>

              <View style={styles.stockRow}>
                <Text style={styles.stockLabel}>Disponibilidad:</Text>
                <Text style={[styles.stockValue, selectedProduct.stock > 0 ? styles.inStock : styles.outOfStock]}>
                  {selectedProduct.stock > 0 ? `En existencia (${selectedProduct.stock} unidades)` : "Agotado"}
                </Text>
              </View>

              <Text style={styles.descriptionLabel}>Descripción:</Text>
              <Text style={styles.descriptionText}>{selectedProduct.descripcion}</Text>

              <TouchableOpacity
                style={[styles.addToCartButton, selectedProduct.stock === 0 ? styles.disabledButton : {}]}
                disabled={selectedProduct.stock === 0}
              >
                <Ionicons name="cart-outline" size={20} color="#fff" />
                <Text style={styles.addToCartText}>Añadir al Carrito</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    padding: 20,
    backgroundColor: "#f5fff7",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4b8063",
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
  errorContainer: {
    margin: 15,
    padding: 15,
    backgroundColor: "#ffebee",
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#ff5252",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: "#5a8a74",
    textAlign: "center",
  },
  productList: {
    padding: 10,
  },
  productCard: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 12,
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
    height: 140,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
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
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stockText: {
    fontSize: 12,
    fontWeight: "500",
  },
  inStock: {
    color: "#18a558",
  },
  outOfStock: {
    color: "#ff5252",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  productDetailCard: {
    backgroundColor: "#fff",
    width: width * 0.9,
    maxHeight: "80%",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#c3e6cd",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  imageSliderContainer: {
    width: "100%",
    height: 200,
  },
  detailImage: {
    width: "100%",
    height: "100%",
  },
  detailContent: {
    padding: 18,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d52",
    marginBottom: 5,
  },
  detailPrice: {
    fontSize: 22,
    fontWeight: "700",
    color: "#18a558",
    marginBottom: 15,
  },
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  stockLabel: {
    fontSize: 16,
    color: "#5a8a74",
    marginRight: 5,
  },
  stockValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e7d52",
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 15,
    color: "#4b8063",
    lineHeight: 22,
    marginBottom: 20,
  },
  addToCartButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#18a558",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: "#a0d8b3",
    opacity: 0.7,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
})
export default CatalogoScreen

