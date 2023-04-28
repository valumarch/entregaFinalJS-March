let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//body
const contenedorProductos = document.getElementById("contenedor-productos");
const abrirCarrito = document.getElementById("abrir-carrito");

//carrito
const carritoAbierto = document.getElementById("sidebar");
const productosCarrito = document.getElementById("productos-carrito");
const carritoLleno = document.getElementById("carrito-lleno");
const sidebarCarrito = document.getElementById("abrir-carrito");
const carritoVacio = document.getElementById("carrito-vacio");
const cantidadCarrito = document.getElementById("cantidad");
const botonVaciar = document.getElementById("boton-vaciar");
const botonComprar = document.getElementById("boton-comprar");


// cargar productos, crear cards

const buscarProductos = async () => {
    const response = await fetch("data.json");
    const productos = await response.json();
    productos.forEach((producto) => {
    let cardProducto = document.createElement("div");
    cardProducto.classList.add("producto");
    cardProducto.innerHTML =`
        <img src="${producto.imagen}">
        <div class="producto-informacion">
        <h3 class="producto-titulo">${producto.nombre}</h3>
        <p class="producto-precio">$${producto.precio}</p>
        `;
    contenedorProductos.append(cardProducto);

    let comprar= document.createElement("button");
    comprar.innerText = "Agregar al carrito";
    comprar.className = "boton-agregar"

    cardProducto.append(comprar);

    comprar.addEventListener("click", ()=>{

        Swal.fire({
            position: 'top-end',
            toast: true,
            background: '#F8F6F3',
            icon: 'success',
            iconColor: '#381D2A',
            color: '#381D2A',
            title: 'Se agregó un producto al carrito',
            showConfirmButton: false,
            timer: 1500
        })
    
        const productoRepetido = carrito.some((repetido) => repetido.id === producto.id);

        if(productoRepetido){
            carrito.map((prod) =>{
                if(prod.id === producto.id){
                    prod.cantidad++;
                }

            });
        }else{
        carrito.push({
            id: producto.id,
            img: producto.imagen,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: producto.cantidad,
        }); };

        contadorCarrito();
        carritoLS();
        armarCarrito();
    });
})
}

buscarProductos();


// carrito 

const armarCarrito = () =>{
    if(carrito.length>0){
        productosCarrito.innerHTML= "";
    carrito.forEach((producto)=>{
        let contenidoCarrito = document.createElement("div");
        contenidoCarrito.className = "contenido-carrito";
        contenidoCarrito.innerHTML =`
        <h3 class="carrito-nombre">${producto.nombre}</h3>
        <p class="carrito-precio">$${producto.precio}</p>
        <div class="cantidad-producto">
        <span class="restar botones-carrito"> - </span>
        <p>${producto.cantidad}</p>
        <span class="sumar botones-carrito"> + </span> 
        </div>
        <p class="carrito-subtotal">Subtotal: $${producto.cantidad * producto.precio}</p>
        <img src="../img/trash3.svg" id="${producto.id}" class="boton-eliminar botones-carrito">
        `;
        productosCarrito.append(contenidoCarrito);

        let botonRestar = contenidoCarrito.querySelector(".restar");
        let botonSumar = contenidoCarrito.querySelector(".sumar");
        let botonEliminar = contenidoCarrito.querySelector(".boton-eliminar");

        botonRestar.addEventListener("click", () => {
            if(producto.cantidad!==1){
            producto.cantidad--;
            }
            carritoLS();
            armarCarrito();
            contadorCarrito();
        });

        botonSumar.addEventListener("click", () => {
            producto.cantidad++;
            carritoLS();
            armarCarrito();
            contadorCarrito();
            
        });

        botonEliminar.addEventListener("click", () => {
            eliminarProducto(producto.id);
        })
        
    });
    }else{
        productosCarrito.innerHTML= "";
        let carritoVacio = document.createElement("p");
        carritoVacio.className = "carrito-vacio";
        carritoVacio.innerHTML = `
        <img src="../img/emoji-triste.svg" alt="emoji de cara triste">
        Tu carrito está vacio
        <img src="../img/emoji-triste.svg" alt="emoji de cara triste">
        `;
        productosCarrito.append(carritoVacio);
    }
    
    const precioTotal = carrito.reduce((acc, el) => acc + el.precio*el.cantidad, 0);

    let totalCompra = document.createElement("div");
    totalCompra.className = "total-compra";
    totalCompra.innerHTML = `<p>Total: $${precioTotal}`;
    productosCarrito.append(totalCompra);

    
};

armarCarrito();

const eliminarProducto = () => {
    const encontrarId = carrito.find((producto) => producto.id);

        carrito = carrito.filter((carritoId) => {
            return carritoId !== encontrarId;
        });
    
    carritoLS();
    armarCarrito();
    contadorCarrito();
};

// cantidad en carrito


const contadorCarrito = () => {
    let numeroProductos = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);

    const carritoCantidad = numeroProductos;

    localStorage.setItem("carritoCantidad", JSON.stringify(carritoCantidad));

    cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoCantidad"));
    
}

contadorCarrito();

// guardando el carrito en el localStorage

const carritoLS = () => {
localStorage.setItem("carrito", JSON.stringify(carrito));
};


// abrir y cerrar el carrito



sidebarCarrito.addEventListener("click", ()=>{
    document.getElementById("sidebar").classList.toggle("active");
});


//vaciar y comprar carrito

botonVaciar.addEventListener("click", () =>{
    carrito.forEach((producto)=>{
        eliminarProducto();
    });
    Swal.fire({
        position: 'center',
        title: 'Su carrito está vacio',
        background: '#F8F6F3',
        iconColor: '#381D2A',
        color: '#381D2A',
        showConfirmButton: false,
        timer: 1500
    });
});

botonComprar.addEventListener("click", () =>{
    if(carrito.length>0){
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Su compra ha sido realizada',
        text: 'Muchas gracias!',
        background: '#F8F6F3',
        iconColor: '#381D2A',
        color: '#381D2A',
        showConfirmButton: false,
        timer: 1500
    });
    }else{
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Su carrito está vacio',
            text: 'Para comprar agregue productos al carrito',
            background: '#F8F6F3',
            iconColor: '#381D2A',
            color: '#381D2A',
            showConfirmButton: false,
            timer: 1500
        });
    }
    carrito.forEach((producto)=>{
        eliminarProducto();
    });
    document.getElementById("sidebar").classList.toggle("active");
    
});

