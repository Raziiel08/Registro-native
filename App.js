import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";

import {
  RegistrarProductos,
  ObtenerProductos,
  ActualizarProducto,
  EliminarProducto,
} from "./src/Services/ProductosDB";

export default function App() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const [productos, setProductos] = useState([]);

  const [editando, setEditando] = useState(null);

  const CargarProductos = async () => {
    try {
      const data = await ObtenerProductos();
      setProductos(data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los productos");
    }
  };

  useEffect(() => {
    CargarProductos();
  }, []);

  const GuardarProductos = async () => {
    if (!nombre || !precio || !stock) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    try {
      const producto = {
        Nombre: nombre,
        Precio: Number(precio),
        Stock: Number(stock),
      };

      if (editando) {
        await ActualizarProducto(editando, producto);

        Alert.alert("Éxito", "Producto actualizado");
      } else {
        await RegistrarProductos(producto);

        Alert.alert("Éxito", "Producto registrado");
      }

      LimpiarFormulario();

      CargarProductos();
    } catch (error) {
      Alert.alert("Error", `No se pudo guardar el producto: ${error.message}`);
    }
  };

  const EditarProducto = (producto) => {
    setNombre(producto.Nombre);
    setPrecio(String(producto.Precio));
    setStock(String(producto.Stock));

    setEditando(producto.ID_Productos);
  };

  const eliminarProducto = async (idProducto) => {
    try {
      await EliminarProducto(idProducto);

      Alert.alert("Éxito", "Producto eliminado");

      CargarProductos();
    } catch (error) {
      Alert.alert("Error", `No se pudo eliminar el producto: ${error.message}`);
    }
  };

  const Eliminar = (idProducto) => {
    if (Platform.OS === "web") {
      if (window.confirm("¿Seguro que querés eliminar este producto?")) {
        eliminarProducto(idProducto);
      }
      return;
    }

    Alert.alert(
      "Eliminar producto",
      "¿Seguro que querés eliminar este producto?",
      [
        {
          text: "Cancelar",
        },
        {
          text: "Eliminar",
          onPress: () => eliminarProducto(idProducto),
        },
      ],
    );
  };

  const LimpiarFormulario = () => {
    setNombre("");
    setPrecio("");
    setStock("");
    setEditando(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Gestión de Productos</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#aaa"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Precio"
        placeholderTextColor="#aaa"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Stock"
        placeholderTextColor="#aaa"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.botonGuardar} onPress={GuardarProductos}>
        <Text style={styles.textoBoton}>
          {editando ? "ACTUALIZAR PRODUCTO" : "GUARDAR PRODUCTO"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonLimpiar} onPress={LimpiarFormulario}>
        <Text style={styles.textoBoton}>LIMPIAR FORMULARIO</Text>
      </TouchableOpacity>

      <Text style={styles.subtitulo}>Productos registrados</Text>

      {productos.map((producto) => (
        <View key={producto.ID_Productos} style={styles.card}>
          <Text style={styles.nombreProducto}>{producto.Nombre}</Text>

          <Text style={styles.dato}>ID: {producto.ID_Productos}</Text>

          <Text style={styles.dato}>Precio: ${producto.Precio}</Text>

          <Text style={styles.dato}>Stock: {producto.Stock}</Text>

          <View style={styles.botones}>
            <TouchableOpacity
              style={styles.botonEditar}
              onPress={() => EditarProducto(producto)}
            >
              <Text style={styles.textoBoton}>EDITAR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botonEliminar}
              onPress={() => Eliminar(producto.ID_Productos)}
            >
              <Text style={styles.textoBoton}>ELIMINAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242847",
    padding: 20,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    marginTop: 30,
  },

  subtitulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginTop: 30,
    marginBottom: 15,
  },

  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  botonGuardar: {
    backgroundColor: "#404d94",
    padding: 15,
    borderRadius: 8,
    marginTop: 5,
  },

  botonLimpiar: {
    backgroundColor: "#666",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },

  textoBoton: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  nombreProducto: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  dato: {
    fontSize: 16,
    marginBottom: 4,
  },

  botones: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },

  botonEditar: {
    backgroundColor: "#404d94",
    padding: 10,
    borderRadius: 6,
    flex: 1,
  },

  botonEliminar: {
    backgroundColor: "#b33",
    padding: 10,
    borderRadius: 6,
    flex: 1,
  },
});
