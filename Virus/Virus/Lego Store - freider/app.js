document.addEventListener("DOMContentLoaded", function () {
  // Obtener referencias a elementos relevantes
  const modal = document.getElementById("my_modal");
  const btnCerrarModal = document.getElementById("btn_cerrar_modal");
  const carritoLista = document.getElementById("carrito_lista");
  const totalPrecio = document.getElementById("total_precio");

  let precioTotal = 0; // Variable para almacenar el precio total

  // Función para actualizar y mostrar la lista de productos en el carrito
  function mostrarCarrito() {
    // Obtener los productos del carrito desde el localStorage
    let carritoProductos = JSON.parse(localStorage.getItem("carrito")) || [];

    // Generar la lista de productos en el carrito y calcular el precio total
    carritoLista.innerHTML = "";
    precioTotal = 0; // Reiniciar el precio total
    carritoProductos.forEach(function (producto, index) {
      carritoLista.innerHTML += `
              <div>
                  <p>${producto.nombre}</p>
                  <p>Precio: ${producto.precio}</p>
                  <input type="number" class="cantidad bg-white" value="${producto.cantidad || 1}" min="1">
                  <button class="btn-eliminar bg-red-700 rounded px-2" data-index="${index}">Eliminar</button>
                  <hr>
              </div>
          `;
      // Calcular el precio total sumando el precio de cada producto
      precioTotal += parseFloat(producto.precio.replace("$", "").replace(",", "")) * (producto.cantidad || 1);
    });

    // Mostrar el precio total en el modal
    totalPrecio.textContent = `Total: $${precioTotal.toFixed(2)}`;

    // Mostrar el modal
    modal.showModal();
  }

  // Agregar evento de clic al botón "Cerrar" del modal
  btnCerrarModal.addEventListener("click", function () {
    modal.close(); // Cerrar el modal
  });

  // Agregar evento de clic al botón de compra de cada producto
  const btnProductos = document.querySelectorAll("[id^='producto']");
  btnProductos.forEach(function (btn) {
    btn.addEventListener("click", function () {
      // Obtener información del producto según el botón presionado
      const productoNombre = this.parentNode.querySelector("p").textContent;
      const productoPrecio = this.parentNode.querySelector(".precio").textContent;

      // Agregar el producto al carrito
      let carritoProductos = JSON.parse(localStorage.getItem("carrito")) || [];
      carritoProductos.push({ nombre: productoNombre, precio: productoPrecio, cantidad: 1 });
      localStorage.setItem("carrito", JSON.stringify(carritoProductos));

      // Mostrar la lista actualizada de productos en el carrito
      mostrarCarrito();
    });
  });

  // Agregar evento de clic a los botones de eliminar productos del carrito
  carritoLista.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-eliminar")) {
      const index = event.target.dataset.index;
      let carritoProductos = JSON.parse(localStorage.getItem("carrito")) || [];
      carritoProductos.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carritoProductos));
      mostrarCarrito(); // Actualizar la lista de productos en el carrito
    }
  });

  // Actualizar la cantidad de productos en el carrito al cambiar el valor en el cuadro de texto
  carritoLista.addEventListener("change", function (event) {
    if (event.target.classList.contains("cantidad")) {
      const index = event.target.parentNode.querySelector(".btn-eliminar").dataset.index;
      const nuevaCantidad = parseInt(event.target.value);
      let carritoProductos = JSON.parse(localStorage.getItem("carrito")) || [];
      if (!isNaN(nuevaCantidad) && nuevaCantidad > 0) {
        carritoProductos[index].cantidad = nuevaCantidad;
        localStorage.setItem("carrito", JSON.stringify(carritoProductos));
        mostrarCarrito(); // Actualizar la lista de productos en el carrito
      } else {
        console.error("La cantidad ingresada no es válida.");
      }
    }
  });

  // Mostrar la lista de productos en el carrito al abrir el modal
  modal.addEventListener("show", mostrarCarrito);

  // Función para vaciar el carrito y recargar la página
  const btnVaciarCarrito = document.getElementById('btn_limpiar_modal');
  btnVaciarCarrito.addEventListener('click', function (e) {
    e.preventDefault();
    // Limpiar el almacenamiento local
    localStorage.clear();
    location.reload(); // Recargar la página después de haber vaciado el carrito de compras
  });

  // Mostrar el precio total al hacer clic en el botón del carrito
  const carroCompras = document.getElementById('carritoCompra');
  carroCompras.addEventListener('click', function (e) {
    e.preventDefault();
    mostrarCarrito(); // Mostrar el carrito de compras
  });

  // Obtener referencia al botón de confirmar compra del modal de confirmación
  const btnConfirmarCompra = document.getElementById('btn_confirmar_modal');

  // Agregar evento de clic al botón de confirmar compra
  btnConfirmarCompra.addEventListener('click', function (e) {
    e.preventDefault();

    // Limpiar el almacenamiento local (vaciar el carrito)
    localStorage.clear();

    // Cerrar el modal de confirmación
    document.getElementById('my_modal_confirmar').close();

    // Recargar la página para mostrar el carrito vacío
    location.reload();
  });
});
