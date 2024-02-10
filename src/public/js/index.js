const socket = io();
const listaproductos = document.querySelector(".listaproductos");

socket.on("listaActualizada", (productos) => {
    console.log("Productos actualizados:", productos);

    if (listaproductos) {/* 
        listaproductos.innerHTML = `<p>${JSON.stringify(productos)}</p>`; */
        
        renderizarProductos(productos);
    } else {
        console.error("El elemento .listaproductos no se encontró en el DOM");
    }
});

function renderizarProductos(data) {
    // Obtener el array de productos del objeto data
    const productos = data.productos;

    // Limpiar la lista antes de agregar los nuevos productos
    listaproductos.innerHTML = "";

    // Iterar sobre los productos y agregarlos a la lista
    productos.forEach(producto => {
        const li = document.createElement("li");
        li.innerHTML = `
            <h2>${producto.titulo}</h2>
            <p>${producto.descripcion}</p>
            <p>Código: ${producto.code}</p>
            <p>Precio: $${producto.precio}</p>
            <p>Estado: ${producto.estado}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <p>Categoría: ${producto.categoria}</p>
            <img src="${producto.imagen}" alt="${producto.titulo}">
        `;
        listaproductos.appendChild(li);
    });
}
