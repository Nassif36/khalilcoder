class Productos {
    constructor() {
        this.id = producto.id;
        this.categoria = producto.categoria;
        this.titulo = producto.titulo.toUpperCase();
        this.descripcion = producto.descripcion;
        this.precio = producto.precio;
        this.img = producto.img;
    }
}

let productos = [];

const botonEliminarTodo = document.getElementById('eliminar-todo');
const guardarLocal = (clave, valor) => {
    localStorage.setItem(clave, valor);
}

// Funcion para reenderizar productos
function renderProductos(array) {
    let productosHTML = '';

    for (const producto of array) {

        productosHTML = productosHTML + `

                <li class="producto">
                    <img src=${producto.img}>
                <div class="producto-texto">
                        <p class="producto-titulo">${producto.titulo}</p>
                        <p>${producto.id}</p>
                        <p class="producto-descripcion">${producto.descripcion}</p>
                        <div class="compra-botones">
                            <button class="btn btn-comprar" data-id="${producto.id}">Agregar al carrito</button>
                            <span>$${producto.precio}</span>
                        </div>
                
                    </div>
                </li>

            `

        document.getElementById('productos').innerHTML = productosHTML;
    }
    const botonAgregar = document.querySelectorAll('.btn-comprar');
    botonAgregar.forEach(el => {
        console.log(el);
        // console.log(el);
        el.addEventListener('click', function (e) {
            e.preventDefault()
            agregarProducto(e);
        });
    });

}

// Convertir el objeto json a array
function objetoArray(array) {
    for (producto of array) {
        productos.push(new Productos(producto.id, producto.categoria, producto.titulo, producto.descripcion, producto.precio))
    }
}

// Eliminar todos los elementos de una
function limpiarStorage() {
    localStorage.clear();
    window.location.reload()
    renderCarrito(arrayCarrito);
}

// Consumir el json
fetch('./productos.json')
    .then((resp) => resp.json())
    .then((data) => {
        let productosJSON = [...data];
        objetoArray(productosJSON);
        console.log(productos);
        renderProductos(productosJSON);
        filtros();
        return productos
    })
console.log(productos);


// Agregar al carrito
function agregarProducto(e) {
    let arrayCarrito = getLocal();
    const found = productos.find(producto => producto.id == e.target.dataset.id);
    arrayCarrito.push(found);
    carrito.innerHTML = arrayCarrito.length;
    Toastify({
        text: "Agregaste " + ' ' + found.titulo,
        className: "info",
        style: {
            background: "linear-gradient(to right, #2063aa, #20aa67)",
        }
    }).showToast();

    console.log(arrayCarrito);
    carrito.innerHTML = arrayCarrito.length;
    let total = [];

    arrayCarrito.forEach(found => {
        total.push(found.precio);
        guardarLocal('productos', JSON.stringify(arrayCarrito));
    });

    renderCarrito();
}

// Eliminar productos uno por uno
function eliminarProducto(e) {
    e.preventDefault();
    let arrayCarrito = getLocal();
    const index = arrayCarrito.findIndex(producto => producto.id == e.target.dataset.id);
    // const found = arrayCarrito.find(producto => producto.id == e.target.dataset.id);
    console.log(index);
    arrayCarrito.splice(index, 1);
    guardarLocal('productos', JSON.stringify(arrayCarrito));
    renderCarrito();
    carrito.innerHTML = arrayCarrito.length;
}

// Mostrar total del carrito
function pintarTotal() {
    let arrayCarrito = getLocal();
    const sumaCarrito = arrayCarrito.reduce(
        (previousValue, currentValue) => previousValue + currentValue.precio, 0
    );
    document.getElementById('total').innerHTML = 'Total: $' + '' + sumaCarrito;
}

botonEliminarTodo.onclick = limpiarStorage;

carrito.innerHTML = 0;


// Capturar los productos guardados a local
function getLocal() {
    return JSON.parse(localStorage.getItem('productos')) || [];
}

// Filtrar por numero de id ascendente
function filtros() {
    productos.sort((a, b) => a.id - b.id);

    // Filtrar por categoria
    let accesorios = productos.filter((producto) => producto.categoria == "Accesorios");
    let indumentaria = productos.filter((producto) => producto.categoria == "Indumentaria");


    const filtroTodos = document.getElementById('todos');
    filtroTodos.addEventListener('click', function () {
        renderProductos(productos);
    });
    const filtroAccesorios = document.getElementById('anteojos');
    filtroAccesorios.addEventListener('click', function () {
        renderProductos(accesorios);
    });


    const filtroIndumentaria = document.getElementById('gorritos');
    filtroIndumentaria.addEventListener('click', function () {
        renderProductos(indumentaria)
    });
}

// Reenderizar productos 
function renderCarrito() {
    let arrayCarrito = getLocal();
    document.getElementById('listaproductos').innerHTML = '';
    let carritoHTML = '';
    for (const producto of arrayCarrito) {
        carritoHTML = carritoHTML + `
                    <li class="producto">
                        <img src=${producto.img}>
                    <div class="producto-texto">
                            <p class="producto-titulo">${producto.titulo}</p>
                
                            <div class="compra-botones">
                                <button class="btn btn-eliminar" data-id="${producto.id}">Eliminar</button>
                                <span>$${producto.precio}</span>
                            </div>
                
                        </div>
                    </li>

                `
        document.getElementById('listaproductos').innerHTML = carritoHTML;
    }
    const botonEliminar = document.querySelectorAll('.btn-eliminar');
    botonEliminar.forEach(el => {
        console.log(el);
        el.addEventListener('click', function (e) {
            e.preventDefault();
            eliminarProducto(e);
        })
    })
    pintarTotal()
}


window.addEventListener('DOMContentLoaded', () => {
    getLocal()
    renderProductos()
    renderCarrito()
});