const contenedor = document.querySelector("#contenedor");
let juegosAlfabeticos = [];
let juegosFavoritos = [];
let requestOptions = {
  method: "GET",
  redirect: "follow",
};

fetch("./json/dbJuegos.json", requestOptions)
  .then((response) => response.json())
  .then((result) => {juegosAlfabeticos = result.sort();})
  .catch((error) => console.log("error", error));

document.querySelector("#btnIndice").onclick = () => {resetView(), indice();};
document.querySelector("#btnJuegos").onclick = () => {resetView(), renderJuegos(juegosAlfabeticos);};
document.querySelector("#btnVerFavorito").onclick = () => {resetView(), renderJuegos(juntarFavoritos);};
document.querySelector("#btnVerFavorito").onclick = () => {resetView(), renderJuegos(juntarFavoritos());};


function resetView() {
  while (contenedor.hasChildNodes()) {
    contenedor.removeChild(contenedor.firstChild);
  }
}

function indice() {
  contenedor.innerHTML = `<ul id="listado" class="container tarjeta card col-4 text-center"></ul>`;
  let card = document.querySelector(".tarjeta");
  for (let i = 0; i < juegosAlfabeticos.length; i += 1) {
    card.innerHTML += `<li><h2 class="indice">${juegosAlfabeticos[i].nombreJuego}</h2></li>`;
  }
}

function renderJuegos(listaJuegos) {
  contenedor.innerHTML = `<ul id="listado" class="row justify-content-center"></ul>`;
  let listado = document.querySelector("#listado");
  for (const juego of listaJuegos) {
    listado.insertAdjacentHTML(
      "beforeend",
      `<li class="card col-12 tarjeta">
			<h2 class="titulo text-center">${juego.nombreJuego}</h2>
			<img id="${juego.id}" class="imagen" src=${juego.imagenJuego} alt="Tapa del juego" class="card-img-top">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-4">
            <img class="img-fluid" src="./images/jugadores.svg"> 
          </div>
          <div class="col-4">
            <img class="img-fluid" src="./images/edad.svg"> 
          </div>
          <div class="col-4">
            <img class="img-fluid" src="./images/reloj.svg"> 
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-4">
            <p class="text-center">${juego.cantidadMinJugadores} - ${juego.cantidadMaxJugadores}</p>
          </div>
          <div class="col-4">
            <p class="text-center">${juego.edadJugadores} +</p>
          </div>
          <div class="col-4">
            <p class="text-center">${juego.tiempoMinJuego} + min.</p>
          </div>
        </div>
      </div>
			<a href=${juego.linkJuego} target="_blank" class="text-center btn btn-primary">Link a la BGG</a>
			<button id="${juego.id}" onclick="localStorageSet(id)" class="text-center btn btn-success">Guardar</button>
			<button id="${juego.id}" onclick="localStorageRemove(id)" class="text-center btn btn-danger">Quitar de Favoritos</button>
		</li>`
    );
  }
}

function busquedaNombre() {
  let input = document.querySelector("#inputNombre");
  let filtro = input.value.toUpperCase();
  let li = document.querySelectorAll("#listado li");
  let txtValue;
  for (i = 0; i < li.length; i += 1) {
    a = li[i].querySelectorAll("h2")[0];
    txtValue = a.textContent || a.innerText;
    txtValue.toUpperCase().indexOf(filtro) > -1
      ? (li[i].style.display = "")
      : (li[i].style.display = "none");
  }
}

function busquedaCantidad() {
  let input = document.querySelector("#inputCantidadJugadores").value;
  let inputNumber = Number(input);
  let li = document.querySelectorAll("#listado li");
  for (i = 0; i < li.length; i += 1) {
    inputNumber >= juegosAlfabeticos[i].cantidadMinJugadores &&
    inputNumber <= juegosAlfabeticos[i].cantidadMaxJugadores
      ? (li[i].style.display = "")
      : (li[i].style.display = "none");
  }
}

function busquedaEdad() {
  let input = document.querySelector("#inputEdad").value;
  let inputNumber = Number(input);
  let li = document.querySelectorAll("#listado li");
  for (i = 0; i < li.length; i += 1) {
    inputNumber >= juegosAlfabeticos[i].edadJugadores
      ? (li[i].style.display = "")
      : (li[i].style.display = "none");
  }
}

if (localStorage.getItem("favoritos") == null) {
  localStorage.setItem("favoritos", "[]");
}

function juntarFavoritos() {
  todosFavoritos = [];
  favoritosId = localStorageGet();
  for (const id of favoritosId) {
    todosFavoritos.push(
      juegosAlfabeticos.find((favorito) => favorito.id == id)
    );
  }
  return todosFavoritos;
}

function localStorageSet(id) {
  const nuevolocal = localStorageGet();
  if (nuevolocal.indexOf(id) !== -1) {
    Swal.fire("Error", "El juego ya esta en favoritos.", "error");
  } else {
    nuevolocal.push(id);
    localStorage.setItem("favoritos", JSON.stringify(nuevolocal));
    Swal.fire(
      "Juego guardado.",
      "Se ha guardado el juego en favorito.",
      "success"
    );
  }
}

function localStorageRemove(id) {
  const arrayId = localStorageGet();
  let index = arrayId.indexOf(id);
  if (index > -1) {
    arrayId.splice(index, 1);
    localStorage.setItem("favoritos", JSON.stringify(arrayId));
    Swal.fire("Juego removido", "El juego ya no esta en favoritos.", "warning");
    renderJuegos(juntarFavoritos());
  } else {
    Swal.fire("Error", "El juego no se encontraba en favoritos.", "error");
  }
}

function localStorageGet() {
  let juegosFavoritos = JSON.parse(localStorage.getItem("favoritos"));
  return juegosFavoritos;
}
