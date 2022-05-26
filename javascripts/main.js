const contenedor = document.querySelector('#contenedor');
const juegosAlfabeticos = juegos.sort(ordenarAlfabeticamente);
let juegosFavoritos = [];


document.querySelector('#btnIndice').onclick = () => { resetView(), indice()};
document.querySelector('#btnJuegos').onclick = () => { resetView(), renderJuegos(juegosAlfabeticos)};
document.querySelector('#btnVerFavorito').onclick = () => { resetView(), renderJuegos(juntarFavoritos)};
document.querySelector("#btnVerFavorito").onclick = () => { resetView(), renderJuegos(juntarFavoritos())};

function ordenarAlfabeticamente(a, b) {
    return a.nombreJuego.localeCompare(b.nombreJuego);
}

function resetView(){
    while (contenedor.hasChildNodes()){
        contenedor.removeChild(contenedor.firstChild)
    }
}

function indice(){
    contenedor.innerHTML = `<ul id="listado" class="tarjeta card col-4 text-center"></ul>`;
    let card = document.querySelector('.tarjeta');
    for (let i = 0; i < juegosAlfabeticos.length ; i +=1){    
        card.innerHTML += `<li><h2 class="indice">${juegosAlfabeticos[i].nombreJuego}</h2></li>`;
    };
}

function renderJuegos(listaJuegos){
    contenedor.innerHTML = `<ul id="listado" class="row"></ul>`;
    let listado = document.querySelector('#listado');
    for (const juego of listaJuegos){
        listado.insertAdjacentHTML('beforeend', 
        `<li class="card col-2 tarjeta">
        <h2 class="titulo text-center">${juego.nombreJuego}</h2>
        <img id="${juego.id}" class="imagen" src=${juego.imagenJuego} alt="Tapa del juego" class="card-img-top">
        <p class="jugadoresMin">Cant. min. de jugadores: ${juego.cantidadMinJugadores}</p>
        <p class="jugadoresMax">Cant. max. de jugadores: ${juego.cantidadMaxJugadores}</p>
        <p>Edad minima recomendada: ${juego.edadJugadores}</p>
        <p>Dificultad: ${juego.dificultadJuego}</p>
        <a href=${juego.linkJuego} target="_blank" class="text-center btn btn-primary">Link a la BGG</a>
        <button id="${juego.id}" onclick="localStorageSet(id)" class="text-center btn btn-primary guardarJuego">Guardar</button>
        <button id="${juego.id}" onclick="localStorageRemove(id)" class="text-center btn btn-primary guardarJuego">Quitar de Favoritos</button>
        </li>`
        );
        let imgSelector = document.getElementById(juego.id);
        imgSelector.addEventListener("mouseover", () => (imgSelector.src = `${juego.imagenJuego2}`));
        imgSelector.addEventListener("mouseout", () => (imgSelector.src = `${juego.imagenJuego}`));
    }
}

function busquedaNombre() {
    let input = document.querySelector('#inputNombre');
    let filtro = input.value.toUpperCase();
    let li = document.querySelectorAll('#listado li');
    let txtValue;
    for (i = 0; i < li.length; i += 1){
        a = li[i].querySelectorAll('h2')[0];
        txtValue = a.textContent || a.innerText;
        txtValue.toUpperCase().indexOf(filtro) > -1 ? li[i].style.display = "" : li[i].style.display = "none";
    }
}

function busquedaCantidad() {
    let input = document.querySelector('#inputCantidadJugadores').value;
    let li = document.querySelectorAll('#listado li');
    for (i = 0; i < li.length; i += 1){
        ((input >= juegos[i].cantidadMinJugadores) && (input <=juegos[i].cantidadMaxJugadores)) ? li[i].style.display = "" : li[i].style.display = "none";
    }
}

function busquedaEdad() {
    let input = document.querySelector('#inputEdad').value;
    let li = document.querySelectorAll('#listado li');
    for (i = 0; i < li.length; i += 1){
        (input >= juegos[i].edadJugadores) ? li[i].style.display = "" : li[i].style.display = "none";
    }
}

if (localStorage.getItem('guardados') == null) {
    localStorage.setItem('guardados','[]');
}

function juntarFavoritos() {
    todosFavoritos = [];
    favoritosId = localStorageGet();
    for (const id of favoritosId) {
        todosFavoritos.push(juegosAlfabeticos.find((favorito) => favorito.id == id));
    }
    return todosFavoritos;
}



function localStorageSet(id) {
    const nuevolocal = localStorageGet();
    nuevolocal.push(id)
    localStorage.setItem('guardados', JSON.stringify(nuevolocal));
    Swal.fire(
        'Juego guardado.',
        'Se ha guardado el juego en favorito.',
        'success'
    )
}

function localStorageRemove(id) {
    const arrayId = localStorageGet();
    console.log(arrayId);
    let index = arrayId.indexOf(id);
    if (index > -1) {
        arrayId.splice(index, 1);
        console.log(arrayId);
        localStorage.setItem("guardados", JSON.stringify(arrayId));
        Swal.fire(
            'Juego removido',
            'El juego ya no esta en favoritos.',
            'warning'
        )
        renderJuegos(juntarFavoritos());
    } else {
        Swal.fire(
            'Error',
            'El juego no se encontraba en favoritos.',
            'error'
        )
    }
}

function localStorageGet() {
    let juegosFavoritos = JSON.parse(localStorage.getItem('guardados'));
    return juegosFavoritos;
}

