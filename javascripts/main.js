const contenedor = document.querySelector("#contenedor");
const busquedas = document.querySelector("#busquedas");
const btnUP = document.querySelector("#btnUp");
const btnIndice = document.querySelector("#btnIndice");
const btnJuegos = document.querySelector("#btnJuegos");
const btnFavoritos = document.querySelector("#btnFavoritos");
const btnCalendario = document.querySelector("#btnCalendario");
const logo = document.querySelector('#logo')

let selectorBusqueda;
let juegosAlfabeticos = [];
let juegosFavoritos = [];
let requestOptions = {
	method: "GET",
	redirect: "follow",
};

fetch("./json/dbJuegos.json", requestOptions)
	.then((response) => response.json())
	.then((result) => {
		juegosAlfabeticos = result.sort();
	})
	.catch((error) => console.log("error", error));

if (localStorage.getItem("favoritos") == null) {
	localStorage.setItem("favoritos", "[]");
}

btnIndice.addEventListener("click", selectIndice);
btnJuegos.addEventListener("click", selectJuegos);
btnFavoritos.addEventListener("click", selectFavoritos);
btnCalendario.addEventListener("click", selectCalendario);
btnUP.addEventListener("click", irArriba);
logo.addEventListener("click", reload);

function selectIndice() {
	resetView(), (selectorBusqueda = "indice"), indice(), showBusqueda();
}

function selectJuegos() {
	resetView(),
		(selectorBusqueda = "juegos"),
		showBusqueda(),
		renderJuegos(juegosAlfabeticos);
}

function selectFavoritos() {
	resetView(),
		(selectorBusqueda = "favoritos"),
		showBusqueda(),
		renderJuegos(juntarFavoritos());
}

function selectCalendario(){
	resetView(),
    (selectorBusqueda = "calendario"),
		console.log(selectorBusqueda);
		showBusqueda(),
      (contenedor.innerHTML = `<iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=America%2FArgentina%2FBuenos_Aires&showNav=1&showCalendars=0&src=cnZlZ2U4ZmE5bHRzOWd2NGI1OGg4cjU3bWdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZXMuYXIjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23C0CA33&color=%237986CB" frameborder="0" scrolling="no" id="calendario"></iframe>`)
}


function renderJuegos(listaJuegos) {
	contenedor.innerHTML = `<ul id="listado" class="row container-fluid justify-content-center gx-0 p-0"></ul>`;
	let listado = document.querySelector("#listado");
	for (const juego of listaJuegos) {
		listado.insertAdjacentHTML(
			"beforeend",
			`<li class="card col tarjeta">
			<h3 class="titulo text-center">${juego.nombreJuego}</h3>
			<div class="contenedorImagen container-fluid d-flex align-items-center">
				<img id="${juego.id}" class="imagen img-fluid" src=${juego.imagenJuego} alt="Tapa del juego" class="card-img-top">
			</div>
      <div class="container">
        <div class="row justify-content-center align-items-center gx-0">
          <div class="col-4">
            <img class="img-fluid" src="./images/jugadores.svg" alt="cantidad de jugadores"> 
          </div>
          <div class="col-4">
            <img class="img-fluid" src="./images/edad.svg" alt="edad recomendada"> 
          </div>
          <div class="col-4">
            <img class="img-fluid" src="./images/reloj.svg" alt="tiempo minimo de juego"> 
          </div>
        </div>
        <div class="row justify-content-center align-items-center gx-0">
          <div class="col-4 text-center info">${juego.cantidadMinJugadores}-${juego.cantidadMaxJugadores}</div>
          <div class="col-4 text-center info">${juego.edadJugadores}+</div>
          <div class="col-4 text-center info">${juego.tiempoMinJuego}/${juego.tiempoMaxJuego}</div>
        </div>
      </div>
			<div>
				<a href=${juego.linkJuego} target="_blank" class="text-center btn btn-primary mb-2">Link a la BGG</a>
				<button id="${juego.id}" value="${juego.linkVideo}" onclick="showVideo(value)" class="text-center btn btn-info mb-2">Video explicativo</button>
				<button id="${juego.id}" onclick="localStorageSet(id)" class="text-center btn btn-success mb-2">Guardar en favoritos</button>
				<button id="${juego.id}" onclick="localStorageRemove(id)" class="text-center btn btn-danger mb-2">Quitar de favoritos</button>
			</div>
		</li>`
		);
		const btnGuardar = document.querySelectorAll(".btn-success");
		const btnEliminar = document.querySelectorAll(".btn-danger");
		const btnSelector = localStorageGet();
		btnGuardar.forEach((btn) => {
			if (btnSelector.find((favorito) => favorito == btn.id)) {
				btn.style.display = "none";
			}
		});
		btnEliminar.forEach((btn) => {
			if (btnSelector.find((favorito) => favorito == btn.id)) {
				btn.style.display = "block";
			}
		});
	}
}

window.onscroll = function () {
	scrollUp();
};

function scrollUp() {
	if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
		btnUP.style.display = "block";
	} else {
		btnUP.style.display = "none";
	}
}

function irArriba() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}

function resetView() {
	while (contenedor.hasChildNodes()) {
		contenedor.removeChild(contenedor.firstChild);
	}
}

function indice() {
	contenedor.innerHTML = `<ul id="listado" class="container tarjetaIndice"></ul>`;
	let card = document.querySelector(".tarjetaIndice");
	for (let i = 0; i < juegosAlfabeticos.length; i += 1) {
		card.innerHTML += `<li><h3 class="indice text-center ">${juegosAlfabeticos[i].nombreJuego}</h3></li>`;
	}
}

function busquedaNombre() {
	let input = document.querySelector("#inputNombre");
	let filtro = input.value.toUpperCase();
	let li = document.querySelectorAll("#listado li");
	let txtValue;
	for (i = 0; i < li.length; i += 1) {
		a = li[i].querySelectorAll("h3")[0];
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

function juntarFavoritos() {
	todosFavoritos = [];
	favoritosId = localStorageGet();
	for (const id of favoritosId) {
		todosFavoritos.push(
			juegosAlfabeticos.find((favorito) => favorito.id == id)
		);
	}
	if (todosFavoritos == "") {
		Swal.fire("Ups!!!", "No tenes ningun juego en favoritos.", "error");
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
	renderJuegos(juegosAlfabeticos);
}

function localStorageRemove(id) {
	const arrayId = localStorageGet();
	let index = arrayId.indexOf(id);
	if (index > -1) {
		arrayId.splice(index, 1);
		localStorage.setItem("favoritos", JSON.stringify(arrayId));
		Swal.fire("Juego removido", "El juego ya no esta en favoritos.", "warning");
		if (selectorBusqueda == "juegos") {
			renderJuegos(juegosAlfabeticos);
		} else {
			renderJuegos(juntarFavoritos());
		}
	} else {
		Swal.fire("Error", "El juego no se encontraba en favoritos.", "error");
	}
}

function localStorageGet() {
	let juegosFavoritos = JSON.parse(localStorage.getItem("favoritos"));
	return juegosFavoritos;
}

function showVideo(value) {
	if (value !== "") {
		Swal.fire({
			title: "Video Explicativo",
			html: `
			<div class="embed-responsive embed-responsive-16by9">
				<iframe class="embed-responsive-item" src="${value}" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope" allowfullscreen></iframe>
			</div>`,
			showCloseButton: true,
			focusConfirm: false,
			confirmButtonText: '<i class="fa fa-thumbs-up"></i> Cerrar',
		});
	} else {
		Swal.fire("Error", "No hay video para este juego.", "error");
	}
}

function showBusqueda() {
	if (selectorBusqueda == "juegos") {
		busquedas.style.display = "block";
	} else {
		busquedas.style.display = "none";
	}
}

function reload() {
	window.location.reload();
}
