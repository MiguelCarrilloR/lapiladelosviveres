import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  Modal,
  useMediaQuery,
  TableFooter,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const InventoryTable = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantities, setQuantities] = useState({}); // Estado para las cantidades
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    brand: "",
    sizeProduct: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [editProductModalOpen, setEditProductModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    brand: "",
    sizeProduct: "",
    price: "",
    stock: "",
  });
  const [categories, setCategories] = useState([]); // Nuevo estado para las categorías
  const [brands, setBrands] = useState([]);
  const [sizeProducts, setSizeProducts] = useState([]);

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    // Verificar si el email y la contraseña existen en el localStorage
    const userEmail = localStorage.getItem("userEmail");
    const userPassword = localStorage.getItem("userPassword");

    if (!userEmail || !userPassword) {
      // Si no existe alguna de las claves, redirigir al login
      navigate("/");
    }
    // Obtener productos al cargar el componente
    axios
      .get("https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/products/products")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        console.log("Productos obtenidos:", response.data);
      })
      .catch((error) => console.error("Error al obtener productos:", error));

    // Obtener todas las categorías desde la base de datos
    axios
      .get("https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/products/categories") // Asegúrate de tener este endpoint
      .then((response) => {
        setCategories(response.data); // Setear las categorías en el estado
      })
      .catch((error) => console.error("Error al obtener categorías:", error));

    axios
      .get("https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/products/brands") // Asegúrate de tener este endpoint
      .then((response) => {
        setBrands(response.data); // Setear las marcas en el estado
      })
      .catch((error) => console.error("Error al obtener categorías:", error));

    axios
      .get("https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/products/sizeProducts") // Asegúrate de tener este endpoint
      .then((response) => {
        setSizeProducts(response.data); // Setear las categorías en el estado
      })
      .catch((error) => console.error("Error al obtener categorías:", error));
  }, [navigate]);

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      axios
        .delete(`https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/products/products/${id}`)
        .then((response) => {
          console.log("Producto eliminado:", response.data);
          // Filtrar el producto eliminado de la lista de productos
          setProducts(products.filter((product) => product._id !== id));
          setFilteredProducts(
            filteredProducts.filter((product) => product._id !== id)
          );
          Toastify({
            text: "¡Producto eliminado!",
            duration: 3000,
            close: true,
            gravity: "top", // "top" o "bottom"
            position: "center", // "left", "center" o "right"
            backgroundColor: "#4CAF50",
          }).showToast();
        })
        .catch((error) => {
          console.error("Error al eliminar el producto:", error);
          Toastify({
            text: "¡Ocurrió un problema para eliminar el producto!",
            duration: 3000,
            close: true,
            gravity: "top", // "top" o "bottom"
            position: "center", // "left", "center" o "right"
            backgroundColor: "#FF0000",
          }).showToast();
        });
    }
  };

  const handleEdit = (id) => {
    const productToEdit = products.find((product) => product._id === id);
    setEditProduct(productToEdit);
    setEditProductModalOpen(true);
  };

  const handleEditProductChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  const handleUpdateProduct = () => {
    if (!editProduct) return;

    axios
      .put(
        `https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/products/products/${editProduct._id}`,
        editProduct
      )
      .then((response) => {
        console.log("Producto actualizado:", response.data);
        setProducts(
          products.map((product) =>
            product._id === editProduct._id ? response.data : product
          )
        );
        setFilteredProducts(
          filteredProducts.map((product) =>
            product._id === editProduct._id ? response.data : product
          )
        );
        setEditProductModalOpen(false);
        setEditProduct(null);
        Toastify({
          text: "¡Producto actualizado con éxito!",
          duration: 3000,
          close: true,
          gravity: "top", // "top" o "bottom"
          position: "center", // "left", "center" o "right"
          backgroundColor: "#4CAF50",
        }).showToast();
      })
      .catch((error) => {
        console.error("Error al actualizar el producto:", error);
        alert("Ocurrió un error al intentar actualizar el producto.");
      });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    const filtered = products.filter((product) => {
      return (
        (updatedFilters.name === "" ||
          product.name
            .toLowerCase()
            .includes(updatedFilters.name.toLowerCase())) &&
        (updatedFilters.category === "" ||
          product.category.includes(updatedFilters.category)) &&
        (updatedFilters.brand === "" ||
          product.brand.includes(updatedFilters.brand)) &&
        (updatedFilters.sizeProduct === "" ||
          product.sizeProduct.includes(updatedFilters.sizeProduct))
      );
    });
    setFilteredProducts(filtered);
  };

  const handleSelectProduct = (id) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((productId) => productId !== id)
        : [...prevSelected, id]
    );
  };

  const handleRegisterSale = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openAddProductModal = () => {
    setAddProductModalOpen(true);
  };

  const closeAddProductModal = () => {
    setAddProductModalOpen(false);
  };

  const closeEditProductModal = () => {
    setEditProductModalOpen(false);
    setEditProduct(null);
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleRegisterSaleSubmit = () => {
    const saleData = {
      products: selectedDetails.map((product) => ({
        id: product._id,
        name: product.name,
        price: product.price + product.price * 0.3,
        quantity: quantities[product._id] || 1, // Cantidad seleccionada
      })),
      totalPrice: calculateTotalPrice(),
      date: new Date(),
    };

    axios
      .post("https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/sales/register", saleData)
      .then(() => {
        // Actualizar stock después de registrar la venta
        axios
          .put("https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/products/update-stock", {
            products: saleData.products,
          })
          .then((response) => {
            console.log(response.data);
            Toastify({
              text: "¡Venta realizada correctamente!",
              duration: 3000,
              close: true,
              gravity: "top", // "top" o "bottom"
              position: "center", // "left", "center" o "right"
              backgroundColor: "#4CAF50",
            }).showToast();
            setModalOpen(false);
            setSelectedProducts([]); // Limpiar la selección
            setProducts((prevProducts) =>
              prevProducts.map((product) => {
                const soldProduct = saleData.products.find(
                  (p) => p.id === product._id
                );
                if (soldProduct) {
                  return {
                    ...product,
                    stock: Math.max(product.stock - soldProduct.quantity, 0),
                  };
                }
                return product;
              })
            );
          })

          .catch((error) => {
            console.error("Error al actualizar el stock:", error);
            Toastify({
              text: "¡Error!",
              duration: 3000,
              close: true,
              gravity: "top", // "top" o "bottom"
              position: "center", // "left", "center" o "right"
              backgroundColor: "#FF0000",
            }).showToast();
          });
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error al registrar la venta:", error);
        Toastify({
          text: "¡Error!",
          duration: 3000,
          close: true,
          gravity: "top", // "top" o "bottom"
          position: "center", // "left", "center" o "right"
          backgroundColor: "#FF0000",
        }).showToast();
      });
  };

  const handleAddProduct = () => {
    // Validar que todos los campos estén completos antes de enviar
    const { name, category, brand, sizeProduct, price, stock } = newProduct;
    if (!name || !category || !brand || !sizeProduct || !price || !stock) {
      Toastify({
        text: "Por favor completa todos los campos",
        duration: 3000,
        close: true,
        gravity: "top", // "top" o "bottom"
        position: "center", // "left", "center" o "right"
        backgroundColor: "#FFB300",
      }).showToast();
      return;
    }

    // Enviar el nuevo producto al backend
    axios
      .post("https://mi-backend-qjzmi4zc5q-uc.a.run.app/api/products/products", newProduct)
      .then((response) => {
        console.log("Producto agregado exitosamente:", response.data);
        setProducts([...products, response.data]); // Agregar el producto a la lista
        setFilteredProducts([...filteredProducts, response.data]); // Actualizar lista filtrada
        setNewProduct({
          name: "",
          category: "",
          brand: "",
          sizeProduct: "",
          price: "",
          stock: "",
        }); // Limpiar el formulario
        setAddProductModalOpen(false); // Cerrar el modal
      })
      .catch((error) => {
        console.error("Error al agregar el producto:", error);
        Toastify({
          text: "¡Error!",
          duration: 3000,
          close: true,
          gravity: "top", // "top" o "bottom"
          position: "center", // "left", "center" o "right"
          backgroundColor: "#FF0000",
        }).showToast();
      });
  };

  // Detalles de los productos seleccionados
  const selectedDetails = filteredProducts.filter((product) =>
    selectedProducts.includes(product._id)
  );

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(0, newQuantity), // Evitar valores negativos
    }));
  };

  // Calcular el precio total dinámico basado en las cantidades
  const calculateTotalPrice = () => {
    return selectedDetails.reduce((total, product) => {
      const quantity = quantities[product._id] || 1; // Usar la cantidad especificada o 1 por defecto
      return total + product.price * 1.3 * quantity;
    }, 0);
  };

  return (
    <Box sx={{ padding: "16px", width: "100%" }}>
      {/* Filtros y botones */}
      <Box
        sx={{
          marginBottom: 2,
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          gap: 2,
        }}
      >
        <TextField
          label="Buscar por nombre"
          name="name"
          variant="outlined"
          value={filters.name}
          onChange={handleFilterChange}
          fullWidth
        />
        <Select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">Categoría</MenuItem>
          {categories.map((category, index) => (
            <MenuItem key={index} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
        <Select
          name="brand"
          value={filters.brand}
          onChange={handleFilterChange}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">Marca</MenuItem>
          {brands.map((brand, index) => (
            <MenuItem key={index} value={brand}>
              {brand}
            </MenuItem>
          ))}
        </Select>
        <Select
          name="sizeProduct"
          value={filters.sizeProduct}
          onChange={handleFilterChange}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">Tamaño</MenuItem>
          {sizeProducts.map((sizeProduct, index) => (
            <MenuItem key={index} value={sizeProduct}>
              {sizeProduct}
            </MenuItem>
          ))}
        </Select>
        <button
          onClick={handleRegisterSale}
          disabled={selectedProducts.length === 0}
          className={`px-6 py-2 bg-blue-600 text-white rounded-lg ${
            selectedProducts.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
        >
          Registrar Venta
        </button>
        <button
          onClick={openAddProductModal}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Añadir Producto
        </button>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Seleccionar</TableCell>
              <TableCell>No</TableCell>
              <TableCell>Nombre Producto</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Tamaño</TableCell>
              <TableCell>Precio Original</TableCell>
              <TableCell>Precio Venta</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product, index) => (
              <TableRow key={product._id}>
                <TableCell
                  sx={{
                    cursor: "pointer", // Hace que toda la celda sea interactiva
                    padding: 0, // Opcional: Ajusta el padding de la celda si es necesario
                  }}
                  onClick={() => handleSelectProduct(product._id)} // Permite seleccionar al hacer clic en la celda
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                  >
                    <Checkbox
                      checked={selectedProducts.includes(product._id)}
                      onChange={(e) => e.stopPropagation()} // Evita conflictos si también haces clic en la celda
                    />
                  </Box>
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.sizeProduct}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>${(product.price * 1.3).toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(product._id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(product._id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Resumen de venta */}
      <Modal open={modalOpen} onClose={closeModal}>
        <Box
          sx={{
            padding: "16px",
            backgroundColor: "white",
            marginTop: "20%",
            marginLeft: isSmallScreen ? "5%" : "30%",
            width: isSmallScreen ? "90%" : "40%",
          }}
        >
          <Typography variant="h6">Resumen de Venta</Typography>
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDetails.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={quantities[product._id] || 1}
                        onChange={(e) =>
                          handleQuantityChange(
                            product._id,
                            parseInt(e.target.value) || 0
                          )
                        }
                        inputProps={{ min: 0 }}
                      />
                    </TableCell>
                    <TableCell>{(product.price * 1.3).toFixed(2)}</TableCell>
                    <TableCell>
                      {(
                        (quantities[product._id] || 1) *
                        product.price *
                        1.3
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    Total
                  </TableCell>
                  <TableCell>{calculateTotalPrice().toFixed(2)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Button variant="outlined" color="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegisterSaleSubmit} // Llama a la función que registra la venta
            >
              Confirmar Venta
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal para editar producto */}
      <Modal open={editProductModalOpen} onClose={closeEditProductModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">Editar Producto</Typography>
          {editProduct && (
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                label="Nombre"
                name="name"
                value={editProduct.name}
                onChange={handleEditProductChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Categoría"
                name="category"
                value={editProduct.category}
                onChange={handleEditProductChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Marca"
                name="brand"
                value={editProduct.brand}
                onChange={handleEditProductChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Tamaño"
                name="sizeProduct"
                value={editProduct.sizeProduct}
                onChange={handleEditProductChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Precio"
                name="price"
                value={editProduct.price}
                onChange={handleEditProductChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Stock"
                name="stock"
                value={editProduct.stock}
                onChange={handleEditProductChange}
                fullWidth
                margin="normal"
              />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateProduct}
                >
                  Guardar
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={closeEditProductModal}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
      {/* Modal para agregar producto */}
      <Modal open={addProductModalOpen} onClose={closeAddProductModal}>
        <Box
          sx={{
            padding: "16px",
            backgroundColor: "white",
            marginTop: "20%",
            marginLeft: isSmallScreen ? "5%" : "30%",
            width: isSmallScreen ? "90%" : "40%",
          }}
        >
          <Typography variant="h6">Registrar Producto</Typography>
          <Box sx={{ marginTop: 2 }}>
            <TextField
              label="Nombre"
              name="name"
              variant="outlined"
              fullWidth
              value={newProduct.name}
              onChange={handleNewProductChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Categoria"
              name="category"
              variant="outlined"
              fullWidth
              value={newProduct.category}
              onChange={handleNewProductChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Marca"
              name="brand"
              variant="outlined"
              fullWidth
              value={newProduct.brand}
              onChange={handleNewProductChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Tamaño"
              name="size"
              variant="outlined"
              fullWidth
              value={newProduct.sizeProduct}
              onChange={handleNewProductChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Precio"
              name="price"
              type="number"
              variant="outlined"
              fullWidth
              value={newProduct.price}
              onChange={handleNewProductChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Cantidad"
              name="stock"
              type="number"
              variant="outlined"
              fullWidth
              value={newProduct.stock}
              onChange={handleNewProductChange}
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddProduct}
              sx={{ marginTop: 2 }}
            >
              Agregar Producto
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default InventoryTable;
