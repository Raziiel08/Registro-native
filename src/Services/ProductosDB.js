import { supabase } from "../Config/supabase.js";

export const RegistrarProductos = async (producto) => {
  const { data, error } = await supabase
    .from("Productos")
    .insert([producto])
    .select();

  if (error) {
    console.log("Error al registrar:", error);
    throw error;
  }

  return data;
};

export const ActualizarProducto = async (idProducto, producto) => {
  const { data, error } = await supabase
    .from("Productos")
    .update(producto)
    .eq("ID_Productos", idProducto)
    .select();

  if (error) {
    console.log("Error al actualizar:", error);
    throw error;
  }

  return data;
};

export const EliminarProducto = async (idProducto) => {
  const { error } = await supabase
    .from("Productos")
    .delete()
    .eq("ID_Productos", idProducto);

  if (error) {
    console.log("Error al eliminar:", error);
    throw error;
  }
};

export const ObtenerProductos = async () => {
  const { data, error } = await supabase.from("Productos").select("*");

  if (error) {
    console.log("Error al obtener productos:", error);
    throw error;
  }

  return data;
};
