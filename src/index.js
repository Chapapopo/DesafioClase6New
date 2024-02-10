import express from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import * as path from "path";
import { Server } from "socket.io";
import GestionProductos from "./GestionProductos.js";

const app = express();
const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Server run Express port: ${PORT}`);
});

const io = new Server(server);

app.use(express.json())
const gestion = new GestionProductos('./src/productos.json', './src/carrito.json');


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

app.use("/", express.static(__dirname + "/public"));

app.get('/home', (req, res) => {
  const ArrayProductos = gestion.mostrarProductos();
  res.render('home', { productos: ArrayProductos });
});

// Renderizar la lista de productos al cargar la página
app.get('/realtimeproducts', (req, res) => {
  const ArrayProductos = gestion.mostrarProductos();
  res.render('index', { productos: ArrayProductos });
});


io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado", socket.id);
})

// Ruta para agregar un nuevo producto (POST)
app.post("/productos", (req, res) => {
  const datosProducto = req.body; // Obtener datos del cuerpo de la solicitud
  gestion.añadirProducto(datosProducto);
  
  // Actualizar la lista de productos
  const ArrayProductos = gestion.mostrarProductos();

  // Emitir el evento "listaActualizada" a todos los clientes conectados
  io.emit("listaActualizada", { productos: ArrayProductos });

  // Redirigir al usuario a la página principal con la lista actualizada
  res.redirect('/realtimeproducts');
});

// Ruta para borrar un producto por ID
app.delete("/productos/:id", (req, res) => {
  const productoId = parseInt(req.params.id);
  gestion.borrarProducto(productoId);
  const ArrayProductos = gestion.mostrarProductos();
  res.json({ message: "Producto eliminado exitosamente" });

  io.emit("listaActualizada", { productos: ArrayProductos })
});